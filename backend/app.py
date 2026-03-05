#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
项目投资评估系统 - Flask后端API
提供项目评估计算、数据校验和结果返回接口
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from typing import Dict, List, Any, Tuple
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# ==========================================
# 数据校验模块
# ==========================================

def validate_number(value: Any, field_name: str, min_val: float = 0) -> Tuple[bool, str, float]:
    """
    验证数字类型字段
    
    Args:
        value: 待验证的值
        field_name: 字段名称
        min_val: 最小值限制
        
    Returns:
        (是否有效, 错误信息, 转换后的值)
    """
    try:
        num_val = float(value)
        if num_val < min_val:
            return False, f"{field_name}不能小于{min_val}", 0
        return True, "", num_val
    except (ValueError, TypeError):
        return False, f"{field_name}必须是有效数字", 0


def validate_required_text(value: Any, field_name: str, min_length: int = 10) -> Tuple[bool, str]:
    """
    验证必填文本字段
    
    Args:
        value: 待验证的值
        field_name: 字段名称
        min_length: 最小长度
        
    Returns:
        (是否有效, 错误信息)
    """
    if not value or not isinstance(value, str):
        return False, f"{field_name}不能为空"
    
    if len(value.strip()) < min_length:
        return False, f"{field_name}内容过短，请至少填写{min_length}个字符"
    
    return True, ""


def validate_hotel_list(hotels: List[Dict], field_name: str) -> Tuple[bool, str]:
    """
    验证酒店列表数据
    
    Args:
        hotels: 酒店列表
        field_name: 字段名称
        
    Returns:
        (是否有效, 错误信息)
    """
    if not isinstance(hotels, list):
        return False, f"{field_name}格式错误"
    
    for idx, hotel in enumerate(hotels):
        if not hotel.get('name'):
            return False, f"{field_name}第{idx+1}项缺少酒店名称"
        
        is_valid, msg, _ = validate_number(hotel.get('distance', 0), f"{field_name}第{idx+1}项距离", 0)
        if not is_valid:
            return False, msg
    
    return True, ""


# ==========================================
# 评分计算模块
# ==========================================

class InvestmentEvaluator:
    """项目投资评估计算器"""
    
    # 地理位置关键词权重配置
    GEO_KEYWORDS = {
        'high': ['阿里巴巴', '杭师大', '未来科技城', '核心区', '商圈', 'CBD', '高新区'],
        'medium': ['产业园', '大学城', '地铁站', '商业区', '交通枢纽'],
        'low': ['郊区', '偏远']
    }
    
    # 客流类型权重
    CUSTOMER_WEIGHTS = {
        '企业年轻员工': 0.4,
        '高校学生': 0.35,
        '商旅与参会客群': 0.25
    }
    
    def __init__(self, data: Dict[str, Any]):
        """
        初始化评估器
        
        Args:
            data: 前端提交的评估数据
        """
        self.data = data
        self.scores = {}  # 存储各维度得分
        
    def calculate_geographic_score(self) -> float:
        """
        计算地理位置得分 (0-10分)
        
        评分规则:
        - 高价值关键词(阿里/杭师大/核心区等): 每个+1.5分
        - 中等价值关键词(产业园/大学城等): 每个+1分
        - 低价值关键词(郊区/偏远等): 每个-2分
        - 基础分: 5分
        """
        text = self.data.get('geographic_location', '')
        score = 5.0  # 基础分
        
        # 高价值关键词
        for keyword in self.GEO_KEYWORDS['high']:
            if keyword in text:
                score += 1.5
        
        # 中等价值关键词
        for keyword in self.GEO_KEYWORDS['medium']:
            if keyword in text:
                score += 1.0
        
        # 低价值关键词（扣分）
        for keyword in self.GEO_KEYWORDS['low']:
            if keyword in text:
                score -= 2.0
        
        # 分数限制在0-10之间
        return max(0, min(10, score))
    
    def calculate_customer_flow_score(self) -> float:
        """
        计算核心客流得分 (0-10分)
        
        评分规则:
        - 每个客群类型根据描述长度和质量评分
        - 加权平均: 企业员工40% + 高校学生35% + 商旅25%
        """
        core_customer = self.data.get('core_customer_flow', {})
        total_score = 0
        
        for customer_type, weight in self.CUSTOMER_WEIGHTS.items():
            desc = core_customer.get(customer_type, '')
            
            # 根据描述长度和关键词评分
            if len(desc) < 20:
                subscore = 0
            elif len(desc) < 50:
                subscore = 6
            elif len(desc) < 100:
                subscore = 8
            else:
                subscore = 9
            
            # 关键词加分
            positive_keywords = ['密集', '活跃', '需求旺盛', '消费能力强', '目标客群']
            for keyword in positive_keywords:
                if keyword in desc:
                    subscore += 0.5
            
            total_score += subscore * weight
        
        return max(0, min(10, total_score))
    
    def calculate_competitive_pattern_score(self) -> float:
        """
        计算竞争格局得分 (0-10分)
        
        评分规则:
        - 结合文本描述和实际竞品数量
        - 直接竞品（电竞酒店）影响最大
        - 潜在竞品（商务酒店）和电竞馆密度影响次之
        - 竞争对手越多，得分越低，风险越高
        """
        pattern = self.data.get('competitive_pattern', {})
        
        # 获取实际竞品数据
        esports_hotels = self.data.get('esports_hotel_distribution', [])
        business_hotels = self.data.get('business_hotel_distribution', [])
        venue_dist = self.data.get('esports_venue_distribution', {})
        
        # 统计数量
        esports_count = len(esports_hotels)
        business_count = len(business_hotels)
        venue_count = venue_dist.get('1km以内', 0) + venue_dist.get('1-2km', 0) + venue_dist.get('2-3km', 0)
        
        score = 10.0
        
        # 1. 电竞酒店竞争（权重最高）
        if esports_count == 0:
            score -= 0  # 市场空白，不扣分
        elif esports_count <= 2:
            score -= 0.5  # 竞争很少
        elif esports_count <= 4:
            score -= 1.5  # 竞争适中
        elif esports_count <= 6:
            score -= 2.5  # 竞争较激烈
        elif esports_count <= 8:
            score -= 3.5  # 竞争激烈
        else:
            score -= 4.5  # 竞争非常激烈
        
        # 2. 电竞馆密度（次要影响）
        if venue_count >= 30:
            score -= 1.5  # 市场过度饱和
        elif venue_count >= 25:
            score -= 1.0
        elif venue_count >= 20:
            score -= 0.5
        
        # 3. 商务酒店潜在竞争
        if business_count >= 10:
            score -= 1.5
        elif business_count >= 8:
            score -= 1.0
        elif business_count >= 5:
            score -= 0.5
        
        # 4. 文本描述修正（加分项）
        direct = pattern.get('直接竞品', '')
        if '市场空白' in direct or '定位差异' in direct or '差异化' in direct:
            score += 0.5  # 虽有竞品但存在差异化机会
        
        return max(0, min(10, score))
    
    def calculate_esports_venue_score(self) -> float:
        """
        计算电竞馆分布得分 (0-10分)
        
        评分规则:
        - 3KM总数 = 1km以内 + 1-2km + 2-3km
        - ≤15家: 9-10分（竞争适中）
        - 15-25家: 6-8分（竞争较激烈）
        - >25家: 0-5分（竞争过度）
        """
        venue = self.data.get('esports_venue_distribution', {})
        
        within_1km = venue.get('1km以内', 0)
        within_2km = venue.get('1-2km', 0)
        within_3km = venue.get('2-3km', 0)
        
        total = within_1km + within_2km + within_3km
        
        if total <= 15:
            return 9.5
        elif total <= 20:
            return 7.5
        elif total <= 25:
            return 6.0
        elif total <= 30:
            return 4.0
        else:
            return 2.0
    
    def calculate_esports_hotel_score(self) -> float:
        """
        计算电竞酒店分布得分 (0-10分)
        
        评分规则:
        - 3km内电竞酒店越少，市场空白越大，得分越高
        - 考虑距离权重：1km内影响最大
        """
        hotels = self.data.get('esports_hotel_distribution', [])
        
        if not hotels:
            return 10.0  # 无竞争，市场空白
        
        # 计算竞争强度
        competition_score = 0
        for hotel in hotels:
            distance = float(hotel.get('distance', 0))
            rooms = int(hotel.get('rooms', 0))
            
            # 距离越近，影响越大
            if distance <= 1:
                competition_score += rooms * 0.8
            elif distance <= 2:
                competition_score += rooms * 0.5
            else:
                competition_score += rooms * 0.3
        
        # 归一化得分
        if competition_score <= 30:
            return 10.0
        elif competition_score <= 60:
            return 8.0
        elif competition_score <= 100:
            return 6.0
        else:
            return 4.0
    
    def calculate_business_hotel_score(self) -> float:
        """
        计算同档次商务酒店分布得分 (0-10分)
        
        评分规则:
        - 商务酒店适量有助于带动客流
        - 过多会增加竞争
        """
        hotels = self.data.get('business_hotel_distribution', [])
        
        if not hotels:
            return 6.0  # 无商务酒店，缺少客流支撑
        
        total_rooms = sum(int(h.get('rooms', 0)) for h in hotels)
        
        if total_rooms <= 100:
            return 7.0  # 商务氛围一般
        elif total_rooms <= 300:
            return 9.0  # 商务氛围良好
        elif total_rooms <= 500:
            return 8.0  # 竞争开始增大
        else:
            return 6.0  # 竞争激烈
    
    def calculate_comprehensive_score(self) -> Dict[str, Any]:
        """
        计算综合投资价值得分
        
        Returns:
            包含各维度得分和综合评估结果的字典
        """
        # 计算各维度得分
        geo_score = self.calculate_geographic_score()
        customer_score = self.calculate_customer_flow_score()
        competitive_score = self.calculate_competitive_pattern_score()
        venue_score = self.calculate_esports_venue_score()
        hotel_score = self.calculate_esports_hotel_score()
        business_score = self.calculate_business_hotel_score()
        
        # 保存维度得分
        self.scores = {
            'geographic_location': round(geo_score, 1),
            'core_customer_flow': round(customer_score, 1),
            'competitive_pattern': round(competitive_score, 1),
            'esports_venue': round(venue_score, 1),
            'esports_hotel': round(hotel_score, 1),
            'business_hotel': round(business_score, 1)
        }
        
        # 优势维度得分 (60%权重)
        # 地理位置40% + 核心客流60%
        advantage_score = (geo_score * 0.4 + customer_score * 0.6) * 0.6
        
        # 风险维度得分 (40%权重)
        # 竞争格局30% + 竞品分布70%（电竞馆20% + 电竞酒店40% + 商务酒店10%）
        risk_score = (
            competitive_score * 0.3 + 
            (venue_score * 0.2 + hotel_score * 0.4 + business_score * 0.1) * 0.7
        ) * 0.4
        
        # 综合得分
        comprehensive_score = advantage_score + risk_score
        
        # 价值等级判定
        if comprehensive_score >= 8.5:
            value_level = "高投资价值"
            recommendation = "强烈推荐投资"
            color = "#10b981"  # 绿色
        elif comprehensive_score >= 7.0:
            value_level = "较高投资价值"
            recommendation = "推荐投资"
            color = "#3b82f6"  # 蓝色
        elif comprehensive_score >= 5.5:
            value_level = "中等投资价值"
            recommendation = "谨慎投资，建议优化方案"
            color = "#f59e0b"  # 黄色
        else:
            value_level = "投资价值偏低"
            recommendation = "不建议投资，风险较高"
            color = "#ef4444"  # 红色
        
        # 生成评估结论
        conclusion = self._generate_conclusion(
            geo_score, customer_score, competitive_score,
            venue_score, hotel_score, business_score
        )
        
        return {
            'advantage_score': round(advantage_score, 2),
            'risk_score': round(risk_score, 2),
            'comprehensive_score': round(comprehensive_score, 2),
            'value_level': value_level,
            'recommendation': recommendation,
            'color': color,
            'dimension_scores': self.scores,
            'conclusion': conclusion
        }
    
    def _generate_conclusion(self, geo: float, customer: float, competitive: float,
                            venue: float, hotel: float, business: float) -> Dict[str, List[str]]:
        """
        生成评估结论
        
        Returns:
            包含优势、风险、建议的字典
        """
        strengths = []
        risks = []
        suggestions = []
        
        # 优势分析
        if geo >= 8:
            strengths.append(f"地理位置优越（{geo}分），处于核心商圈或产业集聚区")
        if customer >= 8:
            strengths.append(f"核心客群匹配度高（{customer}分），目标客户群体明确且活跃")
        if hotel >= 8:
            strengths.append(f"电竞酒店市场空白（{hotel}分），竞争压力小，先发优势明显")
        if competitive >= 8:
            strengths.append(f"竞争格局良好（{competitive}分），直接竞品较少")
        
        # 风险分析
        if geo < 6:
            risks.append(f"地理位置一般（{geo}分），可能影响客流量")
        if customer < 6:
            risks.append(f"核心客群覆盖不足（{customer}分），需加强市场调研")
        if venue >= 8 and hotel >= 7:
            risks.append("电竞馆密集且电竞酒店较多，市场竞争激烈")
        if competitive < 6:
            risks.append(f"竞争格局复杂（{competitive}分），存在较多直接或潜在竞品")
        
        # 优化建议
        if geo < 7:
            suggestions.append("建议选择靠近高校、产业园或商圈的位置")
        if customer < 7:
            suggestions.append("建议深入调研目标客群需求，制定差异化运营策略")
        if venue < 6:
            suggestions.append("电竞馆较少，建议加强线下推广，培育电竞氛围")
        if hotel < 6:
            suggestions.append("电竞酒店竞争激烈，建议打造特色主题房型或服务")
        if business < 7:
            suggestions.append("建议与周边商务酒店建立合作关系，互导客流")
        
        # 默认建议
        if not suggestions:
            suggestions.append("项目整体条件良好，建议按计划推进")
        
        return {
            'strengths': strengths if strengths else ['项目具备一定发展潜力'],
            'risks': risks if risks else ['整体风险可控'],
            'suggestions': suggestions
        }


# ==========================================
# API路由
# ==========================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'message': '项目投资评估系统运行正常'
    })


@app.route('/api/calculate_score', methods=['POST'])
def calculate_score():
    """
    项目评估计算接口
    
    接收前端表单数据，返回评估结果
    """
    try:
        # 获取请求数据
        data = request.get_json()
        
        if not data:
            return jsonify({
                'code': 400,
                'msg': '请求数据为空',
                'data': None
            }), 400
        
        # 数据校验
        validation_errors = []
        
        # 1. 验证地理位置
        is_valid, msg = validate_required_text(
            data.get('geographic_location'), 
            '地理位置',
            min_length=10
        )
        if not is_valid:
            validation_errors.append(msg)
        
        # 2. 验证核心客流（至少填写一项）
        core_customer = data.get('core_customer_flow', {})
        if not isinstance(core_customer, dict):
            validation_errors.append('核心客流数据格式错误')
        else:
            has_customer = any(
                core_customer.get(key, '').strip() 
                for key in ['企业年轻员工', '高校学生', '商旅与参会客群']
            )
            if not has_customer:
                validation_errors.append('核心客流至少填写一项')
        
        # 3. 验证竞争格局
        pattern = data.get('competitive_pattern', {})
        if not isinstance(pattern, dict):
            validation_errors.append('竞争格局数据格式错误')
        
        # 4. 验证电竞馆分布
        venue = data.get('esports_venue_distribution', {})
        if not isinstance(venue, dict):
            validation_errors.append('电竞馆分布数据格式错误')
        else:
            for key in ['1km以内', '1-2km', '2-3km']:
                is_valid, msg, _ = validate_number(
                    venue.get(key, 0),
                    f'电竞馆分布-{key}',
                    min_val=0
                )
                if not is_valid:
                    validation_errors.append(msg)
        
        # 5. 验证电竞酒店分布
        is_valid, msg = validate_hotel_list(
            data.get('esports_hotel_distribution', []),
            '电竞酒店分布'
        )
        if not is_valid:
            validation_errors.append(msg)
        
        # 6. 验证商务酒店分布
        is_valid, msg = validate_hotel_list(
            data.get('business_hotel_distribution', []),
            '同档次商务酒店分布'
        )
        if not is_valid:
            validation_errors.append(msg)
        
        # 如果有验证错误，返回错误信息
        if validation_errors:
            return jsonify({
                'code': 400,
                'msg': '数据验证失败',
                'errors': validation_errors,
                'data': None
            }), 400
        
        # 执行评估计算
        evaluator = InvestmentEvaluator(data)
        result = evaluator.calculate_comprehensive_score()
        
        logger.info(f"评估完成 - 综合得分: {result['comprehensive_score']}")
        
        # 返回成功结果
        return jsonify({
            'code': 200,
            'msg': '评估成功',
            'data': result
        })
        
    except Exception as e:
        logger.error(f"评估计算异常: {str(e)}", exc_info=True)
        return jsonify({
            'code': 500,
            'msg': f'服务器错误: {str(e)}',
            'data': None
        }), 500


@app.route('/api/save_evaluation', methods=['POST'])
def save_evaluation():
    """
    保存评估记录接口（可选功能）
    
    后续可扩展为保存到数据库
    """
    try:
        data = request.get_json()
        
        # 这里可以添加数据库保存逻辑
        # 目前只返回成功响应
        
        return jsonify({
            'code': 200,
            'msg': '保存成功',
            'data': {
                'id': 'temp_id_12345'  # 临时ID，实际应从数据库获取
            }
        })
        
    except Exception as e:
        logger.error(f"保存评估记录异常: {str(e)}", exc_info=True)
        return jsonify({
            'code': 500,
            'msg': f'保存失败: {str(e)}',
            'data': None
        }), 500


# ==========================================
# 错误处理
# ==========================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'code': 404,
        'msg': '接口不存在',
        'data': None
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'code': 500,
        'msg': '服务器内部错误',
        'data': None
    }), 500


# ==========================================
# 主程序入口
# ==========================================

if __name__ == '__main__':
    # 开发环境配置
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
