// ==========================================
// 投资评估模块 - JavaScript逻辑
// ==========================================

// 后端API配置 - 自动检测环境
const API_BASE_URL = (() => {
    // 如果是本地开发环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // 如果是沙箱环境，使用5000端口的公共URL
    if (window.location.hostname.includes('sandbox.novita.ai')) {
        // 将3000端口改为5000端口
        return window.location.protocol + '//' + window.location.hostname.replace('3000-', '5000-') + '/api';
    }
    // 默认使用相对路径
    return '/api';
})();

console.log('API_BASE_URL:', API_BASE_URL);

// 存储草稿数据
let assessmentDraftData = {};
let esportsHotelsCount = 0;
let businessHotelsCount = 0;

// ==========================================
// LocalStorage草稿管理
// ==========================================

// 保存草稿
function saveAssessmentDraft() {
    try {
        const formData = getAssessmentFormData();
        localStorage.setItem('assessment_draft', JSON.stringify(formData));
        console.log('草稿已保存');
    } catch (error) {
        console.error('保存草稿失败:', error);
    }
}

// 加载草稿
function loadAssessmentDraft() {
    try {
        const draft = localStorage.getItem('assessment_draft');
        if (draft) {
            const data = JSON.parse(draft);
            // 填充表单
            document.getElementById('geographic_location').value = data.geographic_location || '';
            document.getElementById('customer_enterprise').value = data.core_customer_flow?.企业年轻员工 || '';
            document.getElementById('customer_student').value = data.core_customer_flow?.高校学生 || '';
            document.getElementById('customer_business').value = data.core_customer_flow?.商旅与参会客群 || '';
            document.getElementById('competitive_direct').value = data.competitive_pattern?.直接竞品 || '';
            document.getElementById('competitive_potential').value = data.competitive_pattern?.潜在竞品 || '';
            document.getElementById('competitive_substitute').value = data.competitive_pattern?.替代娱乐 || '';
            document.getElementById('venue_1km').value = data.esports_venue_distribution?.['1km以内'] || 0;
            document.getElementById('venue_2km').value = data.esports_venue_distribution?.['1-2km'] || 0;
            document.getElementById('venue_3km').value = data.esports_venue_distribution?.['2-3km'] || 0;
            document.getElementById('venue_remarks').value = data.esports_venue_distribution?.remarks || '';
            document.getElementById('business_area_remarks').value = data.business_area_remarks || '';
            
            // 恢复动态酒店表单
            if (data.esports_hotel_distribution && data.esports_hotel_distribution.length > 0) {
                data.esports_hotel_distribution.forEach(hotel => {
                    addEsportsHotel();
                    const container = document.querySelector(`#esports-hotel-${esportsHotelsCount-1}`);
                    if (container) {
                        container.querySelector('input[name="esports_hotel_name"]').value = hotel.name || '';
                        container.querySelector('input[name="esports_hotel_distance"]').value = hotel.distance || '';
                        container.querySelector('input[name="esports_hotel_rooms"]').value = hotel.rooms || '';
                        container.querySelector('input[name="esports_hotel_price_range"]').value = hotel.price_range || '';
                        container.querySelector('input[name="esports_hotel_grade"]').value = hotel.grade || '';
                    }
                });
            }
            
            if (data.business_hotel_distribution && data.business_hotel_distribution.length > 0) {
                data.business_hotel_distribution.forEach(hotel => {
                    addBusinessHotel();
                    const container = document.querySelector(`#business-hotel-${businessHotelsCount-1}`);
                    if (container) {
                        container.querySelector('input[name="business_hotel_name"]').value = hotel.name || '';
                        container.querySelector('input[name="business_hotel_distance"]').value = hotel.distance || '';
                        container.querySelector('input[name="business_hotel_rooms"]').value = hotel.rooms || '';
                        container.querySelector('input[name="business_hotel_price_range"]').value = hotel.price_range || '';
                        container.querySelector('input[name="business_hotel_grade"]').value = hotel.grade || '';
                    }
                });
            }
            
            console.log('草稿已加载');
        }
    } catch (error) {
        console.error('加载草稿失败:', error);
    }
}

// 清除草稿
function clearAssessmentDraft() {
    localStorage.removeItem('assessment_draft');
    console.log('草稿已清除');
}

// ==========================================
// 动态酒店表单管理
// ==========================================

// 添加电竞酒店
function addEsportsHotel() {
    esportsHotelsCount++;
    const container = document.getElementById('esports-hotels-container');
    const hotelId = `esports-hotel-${esportsHotelsCount}`;
    
    const hotelHTML = `
        <div class="hotel-item" id="${hotelId}" data-index="${esportsHotelsCount}">
            <div class="hotel-item-header">
                <span class="hotel-item-title">电竞酒店 #${esportsHotelsCount}</span>
                <button type="button" class="btn-remove" onclick="removeEsportsHotel('${hotelId}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    删除
                </button>
            </div>
            <div class="hotel-item-grid">
                <div class="form-group">
                    <label>酒店名称 <span class="required">*</span></label>
                    <input type="text" name="esports_hotel_name" placeholder="例如：XX电竞酒店" required />
                </div>
                <div class="form-group">
                    <label>距离（km） <span class="required">*</span></label>
                    <input type="number" name="esports_hotel_distance" min="0" step="0.1" placeholder="0.5" required />
                </div>
                <div class="form-group">
                    <label>房间数</label>
                    <input type="number" name="esports_hotel_rooms" min="1" placeholder="30" />
                </div>
                <div class="form-group">
                    <label>价格区间（元/晚）</label>
                    <input type="text" name="esports_hotel_price_range" placeholder="200-500" />
                </div>
                <div class="form-group">
                    <label>等级/星级</label>
                    <input type="text" name="esports_hotel_grade" placeholder="三星级" />
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', hotelHTML);
    saveAssessmentDraft(); // 自动保存
}

// 删除电竞酒店
function removeEsportsHotel(hotelId) {
    const element = document.getElementById(hotelId);
    if (element) {
        element.remove();
        saveAssessmentDraft(); // 自动保存
    }
}

// 添加商务酒店
function addBusinessHotel() {
    businessHotelsCount++;
    const container = document.getElementById('business-hotels-container');
    const hotelId = `business-hotel-${businessHotelsCount}`;
    
    const hotelHTML = `
        <div class="hotel-item" id="${hotelId}" data-index="${businessHotelsCount}">
            <div class="hotel-item-header">
                <span class="hotel-item-title">商务酒店 #${businessHotelsCount}</span>
                <button type="button" class="btn-remove" onclick="removeBusinessHotel('${hotelId}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    删除
                </button>
            </div>
            <div class="hotel-item-grid">
                <div class="form-group">
                    <label>酒店名称 <span class="required">*</span></label>
                    <input type="text" name="business_hotel_name" placeholder="例如：XX商务酒店" required />
                </div>
                <div class="form-group">
                    <label>距离（km） <span class="required">*</span></label>
                    <input type="number" name="business_hotel_distance" min="0" step="0.1" placeholder="0.5" required />
                </div>
                <div class="form-group">
                    <label>房间数</label>
                    <input type="number" name="business_hotel_rooms" min="1" placeholder="100" />
                </div>
                <div class="form-group">
                    <label>价格区间（元/晚）</label>
                    <input type="text" name="business_hotel_price_range" placeholder="300-600" />
                </div>
                <div class="form-group">
                    <label>等级/星级</label>
                    <input type="text" name="business_hotel_grade" placeholder="四星级" />
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', hotelHTML);
    saveAssessmentDraft(); // 自动保存
}

// 删除商务酒店
function removeBusinessHotel(hotelId) {
    const element = document.getElementById(hotelId);
    if (element) {
        element.remove();
        saveAssessmentDraft(); // 自动保存
    }
}

// ==========================================
// 表单数据收集
// ==========================================

function getAssessmentFormData() {
    // 基础字段
    const data = {
        geographic_location: document.getElementById('geographic_location').value.trim(),
        core_customer_flow: {
            '企业年轻员工': document.getElementById('customer_enterprise').value.trim(),
            '高校学生': document.getElementById('customer_student').value.trim(),
            '商旅与参会客群': document.getElementById('customer_business').value.trim()
        },
        competitive_pattern: {
            '直接竞品': document.getElementById('competitive_direct').value.trim(),
            '潜在竞品': document.getElementById('competitive_potential').value.trim(),
            '替代娱乐': document.getElementById('competitive_substitute').value.trim()
        },
        esports_venue_distribution: {
            '1km以内': parseInt(document.getElementById('venue_1km').value) || 0,
            '1-2km': parseInt(document.getElementById('venue_2km').value) || 0,
            '2-3km': parseInt(document.getElementById('venue_3km').value) || 0,
            'remarks': document.getElementById('venue_remarks').value.trim()
        },
        esports_hotel_distribution: [],
        business_hotel_distribution: [],
        business_area_remarks: document.getElementById('business_area_remarks').value.trim()
    };
    
    // 收集电竞酒店数据
    const esportsHotels = document.querySelectorAll('#esports-hotels-container .hotel-item');
    esportsHotels.forEach(hotel => {
        const hotelData = {
            name: hotel.querySelector('input[name="esports_hotel_name"]').value.trim(),
            distance: parseFloat(hotel.querySelector('input[name="esports_hotel_distance"]').value) || 0,
            rooms: parseInt(hotel.querySelector('input[name="esports_hotel_rooms"]').value) || 0,
            price_range: hotel.querySelector('input[name="esports_hotel_price_range"]').value.trim(),
            grade: hotel.querySelector('input[name="esports_hotel_grade"]').value.trim()
        };
        if (hotelData.name && hotelData.distance >= 0) {
            data.esports_hotel_distribution.push(hotelData);
        }
    });
    
    // 收集商务酒店数据
    const businessHotels = document.querySelectorAll('#business-hotels-container .hotel-item');
    businessHotels.forEach(hotel => {
        const hotelData = {
            name: hotel.querySelector('input[name="business_hotel_name"]').value.trim(),
            distance: parseFloat(hotel.querySelector('input[name="business_hotel_distance"]').value) || 0,
            rooms: parseInt(hotel.querySelector('input[name="business_hotel_rooms"]').value) || 0,
            price_range: hotel.querySelector('input[name="business_hotel_price_range"]').value.trim(),
            grade: hotel.querySelector('input[name="business_hotel_grade"]').value.trim()
        };
        if (hotelData.name && hotelData.distance >= 0) {
            data.business_hotel_distribution.push(hotelData);
        }
    });
    
    return data;
}

// ==========================================
// 前端表单验证
// ==========================================

function validateAssessmentForm() {
    const errors = [];
    
    // 验证地理位置
    const geoLocation = document.getElementById('geographic_location').value.trim();
    if (!geoLocation || geoLocation.length < 10) {
        errors.push('地理位置描述至少需要10个字符');
    }
    
    // 验证核心客流（至少填写一项）
    const enterprise = document.getElementById('customer_enterprise').value.trim();
    const student = document.getElementById('customer_student').value.trim();
    const business = document.getElementById('customer_business').value.trim();
    if (!enterprise && !student && !business) {
        errors.push('核心客流至少需要填写一项');
    }
    
    // 验证电竞馆分布数字
    const venue1km = document.getElementById('venue_1km').value;
    const venue2km = document.getElementById('venue_2km').value;
    const venue3km = document.getElementById('venue_3km').value;
    
    if (venue1km === '' || venue2km === '' || venue3km === '') {
        errors.push('电竞馆分布的三个距离段都必须填写数字');
    }
    
    if (parseInt(venue1km) < 0 || parseInt(venue2km) < 0 || parseInt(venue3km) < 0) {
        errors.push('电竞馆数量不能为负数');
    }
    
    // 验证动态酒店表单
    const esportsHotels = document.querySelectorAll('#esports-hotels-container .hotel-item');
    esportsHotels.forEach((hotel, index) => {
        const name = hotel.querySelector('input[name="esports_hotel_name"]').value.trim();
        const distance = hotel.querySelector('input[name="esports_hotel_distance"]').value;
        
        if (!name) {
            errors.push(`电竞酒店 #${index + 1} 缺少酒店名称`);
        }
        if (!distance || parseFloat(distance) < 0) {
            errors.push(`电竞酒店 #${index + 1} 距离必须为非负数`);
        }
    });
    
    const businessHotels = document.querySelectorAll('#business-hotels-container .hotel-item');
    businessHotels.forEach((hotel, index) => {
        const name = hotel.querySelector('input[name="business_hotel_name"]').value.trim();
        const distance = hotel.querySelector('input[name="business_hotel_distance"]').value;
        
        if (!name) {
            errors.push(`商务酒店 #${index + 1} 缺少酒店名称`);
        }
        if (!distance || parseFloat(distance) < 0) {
            errors.push(`商务酒店 #${index + 1} 距离必须为非负数`);
        }
    });
    
    return errors;
}

// ==========================================
// 表单提交处理
// ==========================================

async function handleAssessmentSubmit(event) {
    event.preventDefault();
    
    // 前端验证
    const errors = validateAssessmentForm();
    if (errors.length > 0) {
        alert('表单验证失败：\n' + errors.join('\n'));
        return;
    }
    
    // 收集表单数据
    const formData = getAssessmentFormData();
    console.log('提交数据:', formData);
    
    // 显示加载动画
    const submitBtn = document.getElementById('submitAssessmentBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner-small"></span> 评估中...';
    
    try {
        // 调用后端API
        const response = await fetch(`${API_BASE_URL}/calculate_score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        console.log('API响应:', result);
        
        if (result.code === 200 && result.data) {
            // 显示评估结果
            displayAssessmentResult(result.data);
            
            // 清除草稿
            clearAssessmentDraft();
        } else {
            // 显示错误信息
            const errorMsg = result.errors ? result.errors.join('\n') : result.msg;
            alert('评估失败：\n' + errorMsg);
        }
        
    } catch (error) {
        console.error('API调用失败:', error);
        alert('网络错误，请检查后端服务是否启动\n错误信息: ' + error.message);
    } finally {
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// ==========================================
// 结果展示
// ==========================================

function displayAssessmentResult(data) {
    // 隐藏表单，显示结果
    document.getElementById('assessment-form-container').style.display = 'none';
    document.getElementById('assessment-result-container').style.display = 'block';
    
    // 滚动到结果区域
    document.getElementById('assessment-result-container').scrollIntoView({ behavior: 'smooth' });
    
    // 填充综合得分
    document.getElementById('comprehensiveScore').textContent = data.comprehensive_score.toFixed(1);
    document.getElementById('valueLevel').textContent = data.value_level;
    document.getElementById('advantageScore').textContent = data.advantage_score.toFixed(1);
    document.getElementById('riskScore').textContent = data.risk_score.toFixed(1);
    
    // 根据得分设置颜色
    const scoreCard = document.querySelector('.result-score-card');
    scoreCard.style.borderColor = data.color;
    document.getElementById('comprehensiveScore').style.color = data.color;
    
    // 填充维度得分
    const scores = data.dimension_scores;
    document.getElementById('dimScore1').textContent = scores.geographic_location;
    document.getElementById('dimScore2').textContent = scores.core_customer_flow;
    document.getElementById('dimScore3').textContent = scores.competitive_pattern;
    document.getElementById('dimScore4').textContent = scores.esports_venue;
    document.getElementById('dimScore5').textContent = scores.esports_hotel;
    document.getElementById('dimScore6').textContent = scores.business_hotel;
    
    // 绘制雷达图
    drawRadarChart(scores);
    
    // 填充评估结论
    displayConclusion(data.conclusion);
}

// 绘制雷达图
function drawRadarChart(scores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    // 销毁旧图表（如果存在）
    if (window.assessmentRadarChart) {
        window.assessmentRadarChart.destroy();
    }
    
    window.assessmentRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['地理位置', '核心客流', '竞争格局', '电竞馆分布', '电竞酒店', '商务酒店'],
            datasets: [{
                label: '维度得分',
                data: [
                    scores.geographic_location,
                    scores.core_customer_flow,
                    scores.competitive_pattern,
                    scores.esports_venue,
                    scores.esports_hotel,
                    scores.business_hotel
                ],
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)'
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 显示评估结论
function displayConclusion(conclusion) {
    // 优势列表
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    conclusion.strengths.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        strengthsList.appendChild(li);
    });
    
    // 风险列表
    const risksList = document.getElementById('risksList');
    risksList.innerHTML = '';
    conclusion.risks.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        risksList.appendChild(li);
    });
    
    // 建议列表
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    conclusion.suggestions.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        suggestionsList.appendChild(li);
    });
}

// ==========================================
// 表单操作函数
// ==========================================

// 返回表单
function backToAssessmentForm() {
    document.getElementById('assessment-result-container').style.display = 'none';
    document.getElementById('assessment-form-container').style.display = 'block';
    document.getElementById('assessment-form-container').scrollIntoView({ behavior: 'smooth' });
}

// 重置表单
function resetAssessmentForm() {
    if (confirm('确定要重置表单吗？所有填写的内容将被清除。')) {
        document.getElementById('investmentAssessmentForm').reset();
        
        // 清除动态酒店表单
        document.getElementById('esports-hotels-container').innerHTML = '';
        document.getElementById('business-hotels-container').innerHTML = '';
        esportsHotelsCount = 0;
        businessHotelsCount = 0;
        
        // 清除草稿
        clearAssessmentDraft();
        
        // 滚动到表单顶部
        document.getElementById('investment-assessment').scrollIntoView({ behavior: 'smooth' });
    }
}

// 导出报告
function exportAssessmentReport() {
    alert('导出报告功能开发中...\n即将支持PDF格式导出');
    // TODO: 实现PDF导出功能
}

// ==========================================
// 页面加载时初始化
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // 绑定表单提交事件
    const assessmentForm = document.getElementById('investmentAssessmentForm');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', handleAssessmentSubmit);
        
        // 表单输入时自动保存草稿
        const formInputs = assessmentForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                // 防抖保存
                clearTimeout(window.assessmentDraftTimer);
                window.assessmentDraftTimer = setTimeout(saveAssessmentDraft, 1000);
            });
        });
        
        // 加载草稿数据
        loadAssessmentDraft();
    }
});
