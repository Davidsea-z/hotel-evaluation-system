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

// 评估表单 ADR 联动投资模型 avgPrice
function syncAdr(val) {
    const adrElem = document.getElementById('avgPrice');
    if (adrElem) {
        adrElem.value = val;
        if (typeof calculate === 'function') calculate();
    }
}

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
            document.getElementById('project_name').value = data.project_name || '';
            const assessAdr = document.getElementById('assessment_adr');
            if (assessAdr && data.adr != null) { assessAdr.value = data.adr; syncAdr(data.adr); }
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
            document.getElementById('venue_remarks').value = data.esports_venue_distribution?.['备注'] || '';
            
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
                    <input type="text" id="esports_hotel_name_${esportsHotelsCount}" name="esports_hotel_name" placeholder="例如：XX电竞酒店" required />
                </div>
                <div class="form-group">
                    <label>距离（km） <span class="required">*</span></label>
                    <input type="number" id="esports_hotel_distance_${esportsHotelsCount}" name="esports_hotel_distance" min="0" step="0.1" placeholder="0.5" required />
                </div>
                <div class="form-group">
                    <label>房间数</label>
                    <input type="number" id="esports_hotel_rooms_${esportsHotelsCount}" name="esports_hotel_rooms" min="1" placeholder="30" />
                </div>
                <div class="form-group">
                    <label>价格区间（元/晚）</label>
                    <input type="text" id="esports_hotel_price_range_${esportsHotelsCount}" name="esports_hotel_price_range" placeholder="200-500" />
                </div>
                <div class="form-group">
                    <label>等级/星级</label>
                    <input type="text" id="esports_hotel_grade_${esportsHotelsCount}" name="esports_hotel_grade" placeholder="例如：经济型、三星级" />
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
                <span class="hotel-item-title">商务酒店 ${businessHotelsCount}</span>
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
                    <input type="text" id="business_hotel_name_${businessHotelsCount}" name="business_hotel_name" placeholder="例如：XX商务酒店" required />
                </div>
                <div class="form-group">
                    <label>距离（km） <span class="required">*</span></label>
                    <input type="number" id="business_hotel_distance_${businessHotelsCount}" name="business_hotel_distance" min="0" step="0.1" placeholder="0.5" required />
                </div>
                <div class="form-group">
                    <label>房间数</label>
                    <input type="number" id="business_hotel_rooms_${businessHotelsCount}" name="business_hotel_rooms" min="1" placeholder="100" />
                </div>
                <div class="form-group">
                    <label>价格区间（元/晚）</label>
                    <input type="text" id="business_hotel_price_range_${businessHotelsCount}" name="business_hotel_price_range" placeholder="300-600" />
                </div>
                <div class="form-group">
                    <label>等级/星级</label>
                    <input type="text" id="business_hotel_grade_${businessHotelsCount}" name="business_hotel_grade" placeholder="例如：中档、四星级" />
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
        project_name: document.getElementById('project_name').value.trim(),
        adr: parseFloat(document.getElementById('assessment_adr').value) || null,
        geographic_location: document.getElementById('geographic_location').value.trim(),
        // 从滴灌通投资模型读取 PCF 和分账频率
        pcf_daily: (function() {
            const roomCount = parseFloat(document.getElementById('roomCount')?.value || 0);
            const occ = parseFloat(document.getElementById('occupancyRate')?.value || 0) / 100;
            const adr = parseFloat(document.getElementById('avgPrice')?.value || 0);
            const ota = parseFloat(document.getElementById('otaRate')?.value || 9) / 100;
            const share = parseFloat(document.getElementById('profitShareRate')?.value || 0) / 100;
            const revpar = adr * occ * (1 - ota);
            return Math.round(roomCount * revpar * share * 100) / 100;
        })(),
        irr_frequency: document.getElementById('irrFrequency')?.value || 'daily',
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
        business_hotel_distribution: []
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
            // 显示评估结果（同时传入原始表单数据用于报告渲染）
            displayAssessmentResult(result.data, formData);
            
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

// 全局保存当前报告数据（供 PDF 导出使用）
let _reportData = null;
let _reportFormData = null;

// 四象限配置（象限颜色 + 子维度）
const QUADRANT_CONFIG = [
    { id: 'return',  label: '回报 Return',      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
    { id: 'yield',   label: '收益够不够 Yield',  color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
    { id: 'risk',    label: '风险 Risk',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
    { id: 'control', label: '管控够不够 Control', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
];

const DIM_CONFIG = [
    // 回报象限（蓝色）
    { key: 'geographic_location', label: '回报强度',     quadrant: 'return',  weight: '回报×40%', color: '#3b82f6', desc: '地段关键词·商圈密度·交通配套' },
    { key: 'core_customer_flow',  label: '回报质量',     quadrant: 'return',  weight: '回报×60%', color: '#60a5fa', desc: '企业员工40%+高校35%+商旅25%加权' },
    // 收益象限（绿色）
    { key: 'pcf_yield',           label: '利润空间',     quadrant: 'yield',   weight: '收益×50%', color: '#10b981', desc: 'PCF日现金流=房间×RevPAR×分成比例' },
    { key: 'frequency',           label: '自动打款频率', quadrant: 'yield',   weight: '收益×50%', color: '#34d399', desc: '日分账10分·周分账7分·双周5分' },
    // 风险象限（红色）
    { key: 'esports_venue',       label: '波动可控性',   quadrant: 'risk',    weight: '风险×40%', color: '#ef4444', desc: '3km电竞馆越少→分流风险越低' },
    { key: 'esports_hotel',       label: '生命周期可见性', quadrant: 'risk',  weight: '风险×60%', color: '#f87171', desc: '3km电竞酒店越少→市场空白越大' },
    // 管控象限（紫色）
    { key: 'business_hotel',      label: '市场参照成熟度', quadrant: 'control', weight: '管控×40%', color: '#8b5cf6', desc: '适量商务酒店代表市场成熟·价格锚点健康' },
    { key: 'differentiation',     label: '差异化管控力', quadrant: 'control', weight: '管控×60%', color: '#a78bfa', desc: '含空白/差异化/独家等关键词得高分' },
];

function displayAssessmentResult(data, formData) {
    _reportData = data;
    _reportFormData = formData || {};

    document.getElementById('assessment-form-container').style.display = 'none';
    document.getElementById('assessment-result-container').style.display = 'block';
    document.getElementById('assessment-result-container').scrollIntoView({ behavior: 'smooth' });

    // ── 报告头部 ──
    const projectName = _reportFormData.project_name || '待评估项目';
    document.getElementById('report-project-name').textContent = projectName;
    document.getElementById('report-meta').textContent =
        `评估时间：${new Date().toLocaleString('zh-CN')}　｜　ADR：${_reportFormData.adr ? _reportFormData.adr + ' 元/晚' : '未填写'}　｜　日PCF：${_reportFormData.pcf_daily ? _reportFormData.pcf_daily.toLocaleString() + ' 元' : '—'}`;
    document.getElementById('comprehensiveScore').textContent = data.comprehensive_score.toFixed(1);
    document.getElementById('valueLevel').textContent = data.value_level;
    document.getElementById('report-recommendation').textContent = data.recommendation;
    document.getElementById('report-header').style.background =
        `linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, ${data.color}99 100%)`;

    // ── 四象限得分卡片 ──
    const qs = data.quadrant_scores || {};
    document.getElementById('returnScore').textContent  = (qs.return_score  ?? '—');
    document.getElementById('yieldScore').textContent   = (qs.yield_score   ?? '—');
    document.getElementById('riskScore').textContent    = (qs.risk_score    ?? '—');
    document.getElementById('controlScore').textContent = (qs.control_score ?? '—');

    // ── 八维评分详情（按象限分组渲染）──
    const scores = data.dimension_scores;
    const dimGrid = document.getElementById('dim-details-grid');
    dimGrid.innerHTML = '';
    // 修改为每象限一个分组卡片，内含2个子维度
    QUADRANT_CONFIG.forEach(q => {
        const dims = DIM_CONFIG.filter(d => d.quadrant === q.id);
        const qScore = qs[q.id + '_score'];
        let innerHTML = '';
        dims.forEach(cfg => {
            const score = scores[cfg.key] ?? 0;
            const pct = (score / 10 * 100).toFixed(0);
            const scoreColor = score >= 8 ? '#10b981' : score >= 6 ? '#3b82f6' : score >= 4 ? '#f59e0b' : '#ef4444';
            innerHTML += `
            <div style="margin-bottom:0.75rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                    <span style="font-size:0.8rem;font-weight:600;color:#374151;">${cfg.label}</span>
                    <span style="font-size:1rem;font-weight:900;color:${scoreColor};">${score}</span>
                </div>
                <div style="background:#e5e7eb;border-radius:999px;height:5px;overflow:hidden;">
                    <div style="width:${pct}%;height:100%;background:${cfg.color};border-radius:999px;transition:width 0.6s ease;"></div>
                </div>
                <div style="font-size:0.68rem;color:#9ca3af;margin-top:0.2rem;display:flex;justify-content:space-between;">
                    <span>${cfg.desc}</span>
                    <span style="color:${cfg.color};font-weight:600;margin-left:4px;">${cfg.weight}</span>
                </div>
            </div>`;
        });
        dimGrid.innerHTML += `
        <div style="background:#f9fafb;border-radius:12px;padding:1rem 1.25rem;border-left:4px solid ${q.color};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.875rem;">
                <span style="font-weight:700;font-size:0.9rem;color:${q.color};">${q.label}</span>
                <span style="font-size:1.4rem;font-weight:900;color:${q.color};">${qScore != null ? qScore.toFixed(1) : '—'}</span>
            </div>
            ${innerHTML}
        </div>`;
    });

    // ── 关键输入数据 ──
    const fd = _reportFormData;
    const esportsCount = (fd.esports_hotel_distribution || []).length;
    const businessCount = (fd.business_hotel_distribution || []).length;
    const venueTotal = ((fd.esports_venue_distribution?.['1km以内'] || 0) +
                        (fd.esports_venue_distribution?.['1-2km'] || 0) +
                        (fd.esports_venue_distribution?.['2-3km'] || 0));
    const freqLabel = { daily: '日分账', weekly: '周分账', biweekly: '双周分账' }[fd.irr_frequency] || '—';
    const keyRows = [
        ['平均房价 ADR',    fd.adr ? fd.adr + ' 元/晚' : '—'],
        ['PCF 日现金流',    fd.pcf_daily ? fd.pcf_daily.toLocaleString() + ' 元/天' : '—'],
        ['分账频率',        freqLabel],
        ['3km内电竞馆',     venueTotal + ' 家'],
        ['直接竞品电竞酒店', esportsCount + ' 家'],
        ['同档次商务酒店',   businessCount + ' 家'],
    ];
    document.getElementById('report-key-data').innerHTML = keyRows.map(([k, v]) => `
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="color:#6b7280;">${k}</span>
            <span style="font-weight:600;color:#1f2937;text-align:right;max-width:55%;">${v}</span>
        </div>`).join('');

    // ── 竞品详情 ──
    const esHotels = fd.esports_hotel_distribution || [];
    const bizHotels = fd.business_hotel_distribution || [];
    document.getElementById('report-esports-hotels').innerHTML = esHotels.length
        ? esHotels.map(h => `<div style="font-size:0.8rem;padding:0.4rem 0;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;">
            <span style="color:#1f2937;font-weight:600;">${h.name}</span>
            <span style="color:#6b7280;">${h.distance}km · ${h.rooms || '?'}间</span>
          </div>`).join('')
        : '<div style="font-size:0.8rem;color:#10b981;padding:0.4rem 0;">✓ 3km内暂无直接竞品</div>';
    document.getElementById('report-business-hotels').innerHTML = bizHotels.length
        ? bizHotels.map(h => `<div style="font-size:0.8rem;padding:0.4rem 0;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;">
            <span style="color:#1f2937;font-weight:600;">${h.name}</span>
            <span style="color:#6b7280;">${h.distance}km · ${h.rooms || '?'}间</span>
          </div>`).join('')
        : '<div style="font-size:0.8rem;color:#6b7280;padding:0.4rem 0;">暂无数据</div>';

    // ── 雷达图 ──
    drawRadarChart(scores);

    // ── 综合结论 ──
    displayConclusion(data.conclusion);
}

// ============================================================
// 手绘风格四象限雷达图
// 轴顺序（顺时针，从顶部正上方开始）：
//   0 现金流可靠性  （Risk  / 风险，红）   ← 顶部
//   1 回报强度      （Return / 回报，蓝）
//   2 回报质量      （Return / 回报，蓝）
//   3 名声敏感度    （Control/ 管控，紫）
//   4 Leverage管控力（Control/ 管控，紫）
//   5 自动报数和打款（Yield  / 收益，绿）
//   6 生意的利润率  （Yield  / 收益，绿）
//   7 波动可控性    （Risk   / 风险，红）   ← 左侧
//   （ 生命周期可见性 作为第8轴，实际用 esports_hotel 值 ）
// NOTE: Chart.js radar 8轴，0轴固定在正上方，顺时针排列
// ============================================================
function drawRadarChart(scores) {
    const canvas = document.getElementById('radarChart');
    const ctx = canvas.getContext('2d');
    if (window.assessmentRadarChart) window.assessmentRadarChart.destroy();

    // ── 数据映射：参照手绘图轴位置 ──────────────────────────
    // 顺时针从顶部：风险上→回报右上→回报右→管控右下→管控下→收益左下→收益左→风险左
    const labels = [
        '现金流可靠性',    // 0  顶  Risk
        '回报强度',        // 1  右上 Return
        '回报质量',        // 2  右   Return
        '名声敏感度',      // 3  右下 Control
        'Leverage管控力',  // 4  下   Control
        '自动报数和打款',  // 5  左下 Yield
        '生意的利润率',    // 6  左   Yield
        '波动可控性',      // 7  左上 Risk (生命周期可见性作为此轴)
    ];

    // 数据：现金流可靠性 ≈ esports_hotel（竞争越少现金流越稳）
    const dataPoints = [
        scores.esports_hotel       ?? 0,  // 0 现金流可靠性
        scores.geographic_location ?? 0,  // 1 回报强度
        scores.core_customer_flow  ?? 0,  // 2 回报质量
        scores.business_hotel      ?? 0,  // 3 名声敏感度
        scores.differentiation     ?? 0,  // 4 Leverage管控力
        scores.frequency           ?? 0,  // 5 自动报数和打款
        scores.pcf_yield           ?? 0,  // 6 生意的利润率
        scores.esports_venue       ?? 0,  // 7 波动可控性
    ];

    // ── 四象限着色：每轴对应象限 ──────────────────────────
    // 顶轴0/左轴7 → 风险红；右上1/右2 → 回报蓝；
    // 右下3/下4 → 管控紫；左下5/左6 → 收益绿
    const axisQuadrant = ['risk','return','return','control','control','yield','yield','risk'];
    const QUAD_COLOR = {
        return:  { main:'#3b82f6', fill:'rgba(59,130,246,0.18)',  label:'回报\nReturn' },
        yield:   { main:'#22c55e', fill:'rgba(34,197,94,0.18)',   label:'收益够不够' },
        risk:    { main:'#ef4444', fill:'rgba(239,68,68,0.18)',   label:'风险\nRisk' },
        control: { main:'#8b5cf6', fill:'rgba(139,92,246,0.18)', label:'管控够不够' },
    };
    const pointColors = dataPoints.map((_, i) => QUAD_COLOR[axisQuadrant[i]].main);

    // ── 手绘象限背景插件 ──────────────────────────────────
    const quadrantBgPlugin = {
        id: 'quadrantBackground',
        beforeDraw(chart) {
            const { ctx, scales: { r } } = chart;
            if (!r) return;
            const cx = r.xCenter, cy = r.yCenter;
            const maxR = r.drawingArea;
            const n = 8;
            const step = (2 * Math.PI) / n;
            // 轴角度：Chart.js 从正上方(-π/2)开始，顺时针
            const angleOf = i => -Math.PI / 2 + i * step;

            // 绘制象限扇形（每象限2轴，共4象限）
            // 象限顺序：[0,1]→Risk, [1,2]→Return, [2,3]→Return跨越到Control...
            // 按图像：右上=蓝回报，右下=紫管控，左下=绿收益，左上=红风险
            const sectors = [
                { from: 0, to: 2, color: 'rgba(239,68,68,0.12)',    stroke:'rgba(239,68,68,0.25)' },  // 轴0-1: 风险→回报 上半右
                { from: 1, to: 3, color: 'rgba(59,130,246,0.12)',   stroke:'rgba(59,130,246,0.25)' }, // 轴1-2: 回报
                { from: 2, to: 4, color: 'rgba(139,92,246,0.10)',   stroke:'rgba(139,92,246,0.25)' }, // 轴2-3: 管控过渡
                { from: 3, to: 5, color: 'rgba(139,92,246,0.12)',   stroke:'rgba(139,92,246,0.25)' }, // 轴3-4: 管控
                { from: 4, to: 6, color: 'rgba(34,197,94,0.10)',    stroke:'rgba(34,197,94,0.25)' },  // 轴4-5: 收益过渡
                { from: 5, to: 7, color: 'rgba(34,197,94,0.12)',    stroke:'rgba(34,197,94,0.25)' },  // 轴5-6: 收益
                { from: 6, to: 8, color: 'rgba(239,68,68,0.10)',    stroke:'rgba(239,68,68,0.25)' },  // 轴6-7: 风险过渡
                { from: 7, to: 9, color: 'rgba(239,68,68,0.08)',    stroke:'rgba(239,68,68,0.20)' },  // 轴7-0: 风险
            ];

            sectors.forEach(s => {
                const a1 = angleOf(s.from), a2 = angleOf(s.to);
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, maxR, a1, a2);
                ctx.closePath();
                ctx.fillStyle = s.color;
                ctx.fill();
                ctx.restore();
            });

            // 手绘风格：用虚线画四条分隔轴线（0°/90°/180°/270°）
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(100,100,100,0.2)';
            ctx.lineWidth = 1;
            [[0, -maxR],[maxR, 0],[0, maxR],[-maxR, 0]].forEach(([dx, dy]) => {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + dx, cy + dy);
                ctx.stroke();
            });
            ctx.setLineDash([]);
            ctx.restore();
        },
        afterDraw(chart) {
            const { ctx, scales: { r }, width, height } = chart;
            if (!r) return;
            const cx = r.xCenter, cy = r.yCenter;
            const maxR = r.drawingArea;
            const pad = 36;

            // ── 四象限大标签（仿手绘图边角文字）──
            const qLabels = [
                { text: ['风险', 'Risk'],       x: cx - maxR - pad,      y: cy - maxR * 0.55, align: 'right',  color: '#ef4444' },
                { text: ['回报', 'Return'],      x: cx + maxR + pad,      y: cy - maxR * 0.55, align: 'left',   color: '#3b82f6' },
                { text: ['管控够不够'],           x: cx + maxR + pad,      y: cy + maxR * 0.55, align: 'left',   color: '#8b5cf6' },
                { text: ['收益够不够'],           x: cx - maxR - pad,      y: cy + maxR * 0.55, align: 'right',  color: '#22c55e' },
            ];

            qLabels.forEach(q => {
                ctx.save();
                ctx.textAlign = q.align;
                ctx.textBaseline = 'middle';
                q.text.forEach((line, li) => {
                    const isEn = /[a-zA-Z]/.test(line);
                    ctx.font = isEn
                        ? `italic 600 13px "Georgia", serif`
                        : `900 15px "PingFang SC","Microsoft YaHei",sans-serif`;
                    ctx.fillStyle = q.color;
                    ctx.globalAlpha = 0.85;
                    ctx.fillText(line, q.x, q.y + li * 19);
                });
                ctx.restore();
            });

            // ── 在各轴末端画刻度值标注（模仿手绘图轴上的数字）──
            const n = 8, step = (2 * Math.PI) / n;
            const ticks = [2, 6, 8, 10];
            ticks.forEach(t => {
                const rr = (t / 10) * maxR;
                for (let i = 0; i < n; i++) {
                    const angle = -Math.PI / 2 + i * step;
                    const tx = cx + rr * Math.cos(angle);
                    const ty = cy + rr * Math.sin(angle);
                    if (i === 0) { // 只在顶轴标注刻度数字
                        ctx.save();
                        ctx.fillStyle = 'rgba(120,80,60,0.7)';
                        ctx.font = '10px "Georgia",serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(String(t), tx + 2, ty - 3);
                        ctx.restore();
                    }
                }
            });
        }
    };

    window.assessmentRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: '维度得分',
                data: dataPoints,
                fill: true,
                backgroundColor: 'rgba(50,50,50,0.07)',
                borderColor: 'rgba(40,40,40,0.75)',
                borderWidth: 2.2,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointBackgroundColor: pointColors,
                pointBorderColor: 'rgba(255,255,255,0.9)',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.08,
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 900, easing: 'easeOutQuart' },
            elements: { line: { borderWidth: 2.2 } },
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        stepSize: 2,
                        display: false,   // 隐藏默认刻度，用插件手绘数字
                        backdropColor: 'transparent',
                    },
                    grid: {
                        color: 'rgba(80,60,40,0.13)',
                        lineWidth: 1,
                        circular: false,
                    },
                    angleLines: {
                        color: 'rgba(80,60,40,0.18)',
                        lineWidth: 1,
                    },
                    pointLabels: {
                        padding: 10,
                        font: ctx2 => {
                            const label = labels[ctx2.index] || '';
                            return {
                                size: label.length > 6 ? 10 : 11,
                                weight: '700',
                                family: '"PingFang SC","Microsoft YaHei",sans-serif',
                            };
                        },
                        color: ctx2 => {
                            const q = axisQuadrant[ctx2.index];
                            return QUAD_COLOR[q]?.main || '#374151';
                        },
                    },
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255,252,245,0.97)',
                    titleColor: '#1f2937',
                    bodyColor: '#374151',
                    borderColor: 'rgba(180,160,120,0.4)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        title: items => labels[items[0].dataIndex],
                        label: item => {
                            const qMap = { risk:'风险', return:'回报', yield:'收益', control:'管控' };
                            const q = axisQuadrant[item.dataIndex];
                            return ` ${qMap[q]} · ${item.raw} 分`;
                        }
                    }
                }
            }
        },
        plugins: [quadrantBgPlugin],
    });

    // ── 画布背景：米黄色仿纸张 ──
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// 显示评估结论
function displayConclusion(conclusion) {
    ['strengthsList','risksList','suggestionsList'].forEach((id, i) => {
        const key = ['strengths','risks','suggestions'][i];
        const el = document.getElementById(id);
        el.innerHTML = '';
        (conclusion[key] || []).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            el.appendChild(li);
        });
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
        document.getElementById('esports-hotels-container').innerHTML = '';
        document.getElementById('business-hotels-container').innerHTML = '';
        esportsHotelsCount = 0;
        businessHotelsCount = 0;
        clearAssessmentDraft();
        document.getElementById('investment-assessment').scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// PDF 导出（html2canvas 截图方案，完整支持中文）
// ==========================================

async function exportAssessmentReport() {
    if (!_reportData) { alert('请先完成评估再导出报告'); return; }

    const btn = document.querySelector('.result-actions .btn-primary');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:6px;vertical-align:middle;"></span>生成中…';

    try {
        const projName = (_reportFormData.project_name || '待评估项目');
        const fileName = `投资评估报告_${projName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'_').slice(0,20)}_${new Date().toLocaleDateString('zh-CN').replace(/\//g,'')}.pdf`;

        // ── 构建独立的打印用 HTML 容器 ──
        const printWrap = document.createElement('div');
        printWrap.id = 'pdf-print-wrap';
        Object.assign(printWrap.style, {
            position: 'fixed', left: '-9999px', top: '0',
            width: '794px', background: '#fff',
            fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
            padding: '0', margin: '0', zIndex: '-1'
        });

        const data = _reportData;
        const fd   = _reportFormData;
        const scores = data.dimension_scores;
        const scoreColor = s => s>=8?'#10b981':s>=6?'#3b82f6':s>=4?'#f59e0b':'#ef4444';
        const pct = s => (s/10*100).toFixed(0);
        const venueTotal = ((fd.esports_venue_distribution?.['1km以内']||0)+(fd.esports_venue_distribution?.['1-2km']||0)+(fd.esports_venue_distribution?.['2-3km']||0));
        const esHotels  = fd.esports_hotel_distribution  || [];
        const bizHotels = fd.business_hotel_distribution || [];

        const dimRows = DIM_CONFIG.map(cfg => {
            const s = scores[cfg.key] ?? 0;
            return `<tr>
              <td style="padding:8px 12px;font-weight:600;color:#1f2937;border-bottom:1px solid #f3f4f6;">
                <span style="display:inline-block;width:4px;height:14px;background:${cfg.color};border-radius:2px;vertical-align:middle;margin-right:8px;"></span>${cfg.label}
              </td>
              <td style="padding:8px 12px;color:#6b7280;font-size:12px;border-bottom:1px solid #f3f4f6;">${cfg.desc}</td>
              <td style="padding:8px 12px;color:#6b7280;font-size:12px;border-bottom:1px solid #f3f4f6;">${cfg.weight}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">
                <div style="background:#e5e7eb;border-radius:999px;height:6px;width:100px;overflow:hidden;display:inline-block;vertical-align:middle;">
                  <div style="width:${pct(s)}%;height:100%;background:${scoreColor(s)};border-radius:999px;"></div>
                </div>
              </td>
              <td style="padding:8px 16px;font-size:1.1rem;font-weight:900;color:${scoreColor(s)};text-align:right;border-bottom:1px solid #f3f4f6;">${s}</td>
            </tr>`;
        }).join('');

        const esportsRows = esHotels.length
            ? esHotels.map(h=>`<tr>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;">${h.name||'—'}</td>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${h.distance||'?'} km</td>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${h.rooms||'?'} 间</td>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${h.price_range||'—'}</td>
              </tr>`).join('')
            : '<tr><td colspan="4" style="padding:10px;color:#10b981;">✓ 3km内暂无直接竞品</td></tr>';

        const bizRows = bizHotels.length
            ? bizHotels.map(h=>`<tr>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;">${h.name||'—'}</td>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${h.distance||'?'} km</td>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${h.rooms||'?'} 间</td>
                <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${h.price_range||'—'}</td>
              </tr>`).join('')
            : '<tr><td colspan="4" style="padding:10px;color:#6b7280;">暂无数据</td></tr>';

        const strLi  = (data.conclusion.strengths   ||[]).map(i=>`<li style="margin:4px 0;line-height:1.6;">${i}</li>`).join('');
        const riskLi = (data.conclusion.risks        ||[]).map(i=>`<li style="margin:4px 0;line-height:1.6;">${i}</li>`).join('');
        const sugLi  = (data.conclusion.suggestions  ||[]).map(i=>`<li style="margin:4px 0;line-height:1.6;">${i}</li>`).join('');

        printWrap.innerHTML = `
        <!-- ======= 封面 ======= -->
        <div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 55%,#4c1d95 100%);color:#fff;padding:60px 48px 50px;position:relative;overflow:hidden;min-height:280px;">
          <div style="font-size:11px;opacity:0.65;letter-spacing:3px;margin-bottom:18px;">MICROCONNECT AI · 电竞酒店投资评估报告</div>
          <div style="font-size:28px;font-weight:900;line-height:1.3;margin-bottom:12px;">${projName}</div>
          <div style="font-size:13px;opacity:0.7;margin-bottom:32px;">评估时间：${new Date().toLocaleString('zh-CN')}</div>
          <div style="display:flex;gap:24px;flex-wrap:wrap;">
            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:16px 24px;min-width:120px;text-align:center;">
              <div style="font-size:11px;opacity:0.75;margin-bottom:4px;">综合投资价值</div>
              <div style="font-size:42px;font-weight:900;line-height:1;">${data.comprehensive_score.toFixed(1)}</div>
              <div style="font-size:13px;font-weight:600;margin-top:4px;">${data.value_level}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;justify-content:center;">
              <div style="background:rgba(59,130,246,0.25);border-radius:8px;padding:8px 18px;font-size:13px;">
                <span style="opacity:0.85;">📈 回报&nbsp;</span><strong>${(data.quadrant_scores?.return_score??'—')}</strong>
              </div>
              <div style="background:rgba(16,185,129,0.25);border-radius:8px;padding:8px 18px;font-size:13px;">
                <span style="opacity:0.85;">💰 收益&nbsp;</span><strong>${(data.quadrant_scores?.yield_score??'—')}</strong>
              </div>
              <div style="background:rgba(239,68,68,0.25);border-radius:8px;padding:8px 18px;font-size:13px;">
                <span style="opacity:0.85;">⚡ 风险&nbsp;</span><strong>${(data.quadrant_scores?.risk_score??'—')}</strong>
              </div>
              <div style="background:rgba(139,92,246,0.25);border-radius:8px;padding:8px 18px;font-size:13px;">
                <span style="opacity:0.85;">🎮 管控&nbsp;</span><strong>${(data.quadrant_scores?.control_score??'—')}</strong>
              </div>
              <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:8px 18px;font-size:13px;">
                <span style="opacity:0.7;">投资建议&nbsp;</span><strong>${data.recommendation}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- ======= 关键数据 ======= -->
        <div style="padding:32px 48px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;">
            <span style="width:4px;height:20px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
            <span style="font-size:16px;font-weight:700;color:#1f2937;">关键输入数据</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px;">
            ${[
              ['平均房价 ADR', fd.adr ? fd.adr+' 元/晚' : '—'],
              ['PCF 日现金流', fd.pcf_daily ? fd.pcf_daily.toLocaleString()+' 元/天' : '—'],
              ['分账频率', ({daily:'日分账',weekly:'周分账',biweekly:'双周分账'}[fd.irr_frequency]||'—')],
              ['3km内电竞馆总数', venueTotal+' 家'],
              ['直接竞品电竞酒店', esHotels.length+' 家'],
              ['同档次商务酒店', bizHotels.length+' 家'],
            ].map(([k,v])=>`
              <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#6b7280;font-size:13px;">${k}</span>
                <span style="font-weight:700;color:#1f2937;font-size:13px;">${v}</span>
              </div>`).join('')}
          </div>

          <!-- ======= 八维评分（四象限）======= -->
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;">
            <span style="width:4px;height:20px;background:#6366f1;border-radius:2px;display:inline-block;"></span>
            <span style="font-size:16px;font-weight:700;color:#1f2937;">八维评分详情（四象限）</span>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:32px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151;">维度</th>
                <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151;">说明</th>
                <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151;">权重</th>
                <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151;">得分进度</th>
                <th style="padding:8px 16px;text-align:right;font-weight:600;color:#374151;">得分</th>
              </tr>
            </thead>
            <tbody>${dimRows}</tbody>
          </table>

          <!-- ======= 竞品市场 ======= -->
          ${(esHotels.length || bizHotels.length) ? `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;">
            <span style="width:4px;height:20px;background:#ef4444;border-radius:2px;display:inline-block;"></span>
            <span style="font-size:16px;font-weight:700;color:#1f2937;">竞品市场详情</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;">
            <div>
              <div style="font-size:12px;font-weight:600;color:#ef4444;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">电竞酒店分布</div>
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <thead><tr style="background:#fef2f2;">
                  <th style="padding:6px 10px;text-align:left;color:#991b1b;">名称</th>
                  <th style="padding:6px 10px;text-align:left;color:#991b1b;">距离</th>
                  <th style="padding:6px 10px;text-align:left;color:#991b1b;">房间</th>
                  <th style="padding:6px 10px;text-align:left;color:#991b1b;">价格</th>
                </tr></thead>
                <tbody>${esportsRows}</tbody>
              </table>
            </div>
            <div>
              <div style="font-size:12px;font-weight:600;color:#3b82f6;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">同档商务酒店</div>
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <thead><tr style="background:#eff6ff;">
                  <th style="padding:6px 10px;text-align:left;color:#1e40af;">名称</th>
                  <th style="padding:6px 10px;text-align:left;color:#1e40af;">距离</th>
                  <th style="padding:6px 10px;text-align:left;color:#1e40af;">房间</th>
                  <th style="padding:6px 10px;text-align:left;color:#1e40af;">价格</th>
                </tr></thead>
                <tbody>${bizRows}</tbody>
              </table>
            </div>
          </div>` : ''}

          <!-- ======= 综合结论 ======= -->
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;">
            <span style="width:4px;height:20px;background:#10b981;border-radius:2px;display:inline-block;"></span>
            <span style="font-size:16px;font-weight:700;color:#1f2937;">综合评估结论</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:40px;">
            <div style="background:#f0fdf4;border-radius:12px;padding:16px 18px;border-left:4px solid #10b981;">
              <div style="font-size:13px;font-weight:700;color:#065f46;margin-bottom:10px;">✅ 项目优势</div>
              <ul style="margin:0;padding-left:16px;font-size:12px;color:#065f46;line-height:1.8;">${strLi}</ul>
            </div>
            <div style="background:#fef2f2;border-radius:12px;padding:16px 18px;border-left:4px solid #ef4444;">
              <div style="font-size:13px;font-weight:700;color:#991b1b;margin-bottom:10px;">⚠️ 风险提示</div>
              <ul style="margin:0;padding-left:16px;font-size:12px;color:#991b1b;line-height:1.8;">${riskLi}</ul>
            </div>
            <div style="background:#eff6ff;border-radius:12px;padding:16px 18px;border-left:4px solid #3b82f6;">
              <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:10px;">💡 优化建议</div>
              <ul style="margin:0;padding-left:16px;font-size:12px;color:#1e40af;line-height:1.8;">${sugLi}</ul>
            </div>
          </div>

          <!-- 页脚 -->
          <div style="border-top:1px solid #e5e7eb;padding-top:16px;text-align:center;font-size:11px;color:#9ca3af;">
            本报告由 MICROCONNECT AI 自动生成，仅供参考，不构成投资建议 · ${new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>`;

        document.body.appendChild(printWrap);
        // 等待渲染完成
        await new Promise(r => setTimeout(r, 300));

        const canvas = await html2canvas(printWrap, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        document.body.removeChild(printWrap);

        const { jsPDF } = window.jspdf;
        const imgW  = 210; // A4 宽度 mm
        const imgH  = canvas.height / canvas.width * imgW;
        const pageH = 297; // A4 高度 mm

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // 分页：将长图按 A4 高度切割
        let yOffset = 0;
        while (yOffset < imgH) {
            if (yOffset > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, -yOffset, imgW, imgH, '', 'FAST');
            yOffset += pageH;
        }

        pdf.save(fileName);
    } catch(e) {
        console.error('PDF导出失败:', e);
        alert('PDF导出失败：' + e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = orig;
    }
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
        
        // 智能解析功能
        setupSmartParse();
    }
});

// ==========================================
// JSON解析功能
// ==========================================

function setupSmartParse() {
    const parseJsonBtn = document.getElementById('parse-json-btn');
    const clearJsonBtn = document.getElementById('clear-json-btn');
    const jsonInput = document.getElementById('json-parse-input');
    const copyTemplateBtn = document.getElementById('copy-json-template-btn');
    const parseResult = document.getElementById('parse-result');
    const parseError = document.getElementById('parse-error');
    const errorMessage = document.getElementById('error-message');

    // 获取JSON模板
    if (copyTemplateBtn && jsonInput) {
        copyTemplateBtn.addEventListener('click', () => {
            jsonInput.value = getJSONTemplate();
            alert('✓ JSON模板已加载！\n请根据您的项目实际情况修改数据');
        });
    }

    // 解析JSON按钮
    if (parseJsonBtn && jsonInput) {
        parseJsonBtn.addEventListener('click', () => {
            const jsonText = jsonInput.value.trim();
            if (!jsonText) {
                showError('请先粘贴JSON数据或点击"获取JSON模板"');
                return;
            }
            try {
                const parsedData = JSON.parse(jsonText);
                console.log('JSON解析结果:', parsedData);
                fillFormWithParsedData(parsedData);
                showSuccess();
                const formContainer = document.getElementById('assessment-form-container');
                if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (error) {
                console.error('JSON解析失败:', error);
                showError('JSON格式错误：' + error.message);
            }
        });
    }

    // 清空按钮
    if (clearJsonBtn && jsonInput) {
        clearJsonBtn.addEventListener('click', () => {
            jsonInput.value = '';
            if (parseResult) parseResult.style.display = 'none';
            if (parseError) parseError.style.display = 'none';
        });
    }

    function showSuccess() {
        if (parseResult) {
            parseResult.style.display = 'block';
            if (parseError) parseError.style.display = 'none';
            setTimeout(() => { parseResult.style.display = 'none'; }, 3000);
        }
    }

    function showError(msg) {
        if (parseError && errorMessage) {
            errorMessage.textContent = msg;
            parseError.style.display = 'block';
            if (parseResult) parseResult.style.display = 'none';
        } else {
            alert(msg);
        }
    }
}

/**
 * 获取JSON模板
 */
function getJSONTemplate() {
    return `{
  "project_name": "某某酒店电竞改造项目",
  "adr": 299,

  "geographic_location": "位于某市核心商圈，毗邻大型科技园区及高校，周边有大型购物中心及交通枢纽，地铁直达",
  
  "core_customer_flow": {
    "企业年轻员工": "周边科技园区互联网从业者约5万人，年龄25-35岁，消费能力强",
    "高校学生": "附近高校距离2公里，学生总数约3万人，电竞社团活跃，周末娱乐需求大",
    "商旅与参会客群": "周边会展中心约1公里，商务出差及会展参会人员密集，日均流量超1000人次"
  },
  
  "competitive_pattern": {
    "直接竞品": "3km范围内无电竞酒店，市场完全空白",
    "潜在竞品": "2家传统网咖，装修陈旧，设备老化，客户体验差",
    "替代娱乐": "电影院2家，KTV 3家，但与电竞客群重叠度低"
  },
  
  "esports_venue_distribution": {
    "1km以内": 5,
    "1-2km": 8,
    "2-3km": 3
  },
  
  "esports_hotel_distribution": [
    {
      "name": "A电竞酒店",
      "distance": 1.2,
      "rooms": 50,
      "price_range": "200-350元"
    },
    {
      "name": "B电竞主题酒店",
      "distance": 2.8,
      "rooms": 30,
      "price_range": "180-280元"
    }
  ],
  
  "business_hotel_distribution": [
    {
      "name": "某经济型酒店A",
      "distance": 0.8,
      "rooms": 80,
      "price_range": "150-250元"
    },
    {
      "name": "某经济型酒店B",
      "distance": 1.5,
      "rooms": 100,
      "price_range": "160-260元"
    },
    {
      "name": "某中档酒店C",
      "distance": 2.0,
      "rooms": 120,
      "price_range": "220-380元"
    }
  ]
}`;
}


/**
 * 用解析的数据填充表单
 */
function fillFormWithParsedData(data) {
    console.log('开始填充表单，数据:', data);

    // ── 优先填充 project_name 和 adr，放最前面避免后续异常导致跳过 ──

    // 填充 project_name → 项目名称
    if (data.project_name) {
        const elem = document.getElementById('project_name');
        if (elem) { elem.value = data.project_name; console.log('✓ 项目名称已填充:', data.project_name); }
    }

    // 填充 adr → assessment_adr（评估表单内）+ avgPrice（投资模型区）
    const adrValue = (data.adr != null) ? data.adr : (data.avg_daily_rate != null ? data.avg_daily_rate : data.average_daily_rate);
    if (adrValue != null) {
        const assessAdr = document.getElementById('assessment_adr');
        if (assessAdr) { assessAdr.value = adrValue; console.log('✓ ADR（评估表单）已填充:', adrValue); }
        const adrElem = document.getElementById('avgPrice');
        if (adrElem) {
            adrElem.value = adrValue;
            if (typeof calculate === 'function') calculate();
            console.log('✓ ADR（投资模型）已同步:', adrValue);
        }
    }

    // 填充地理位置
    if (data.geographic_location) {
        const elem = document.getElementById('geographic_location');
        if (elem) { elem.value = data.geographic_location; console.log('✓ 地理位置已填充'); }
    }

    // 填充核心客流（用可选链防止 core_customer_flow 不存在时崩溃）
    if (data.core_customer_flow?.['企业年轻员工']) {
        const elem = document.getElementById('customer_enterprise');
        if (elem) { elem.value = data.core_customer_flow['企业年轻员工']; console.log('✓ 企业员工已填充'); }
    }
    if (data.core_customer_flow?.['高校学生']) {
        const elem = document.getElementById('customer_student');
        if (elem) { elem.value = data.core_customer_flow['高校学生']; console.log('✓ 高校学生已填充'); }
    }
    if (data.core_customer_flow?.['商旅与参会客群']) {
        const elem = document.getElementById('customer_business');
        if (elem) { elem.value = data.core_customer_flow['商旅与参会客群']; console.log('✓ 商旅客群已填充'); }
    }

    // 填充竞争格局（用可选链防止 competitive_pattern 不存在时崩溃）
    if (data.competitive_pattern?.['直接竞品']) {
        const elem = document.getElementById('competitive_direct');
        if (elem) { elem.value = data.competitive_pattern['直接竞品']; console.log('✓ 直接竞品已填充'); }
    }
    if (data.competitive_pattern?.['潜在竞品']) {
        const elem = document.getElementById('competitive_potential');
        if (elem) { elem.value = data.competitive_pattern['潜在竞品']; console.log('✓ 潜在竞品已填充'); }
    }
    if (data.competitive_pattern?.['替代娱乐']) {
        const elem = document.getElementById('competitive_substitute');
        if (elem) { elem.value = data.competitive_pattern['替代娱乐']; console.log('✓ 替代娱乐已填充'); }
    }

    // 填充电竞馆分布（用可选链防止 esports_venue_distribution 不存在时崩溃）
    if (data.esports_venue_distribution?.['1km以内'] != null) {
        const elem = document.getElementById('venue_1km');
        if (elem) { elem.value = data.esports_venue_distribution['1km以内']; }
    }
    if (data.esports_venue_distribution?.['1-2km'] != null) {
        const elem = document.getElementById('venue_2km');
        if (elem) { elem.value = data.esports_venue_distribution['1-2km']; }
    }
    if (data.esports_venue_distribution?.['2-3km'] != null) {
        const elem = document.getElementById('venue_3km');
        if (elem) { elem.value = data.esports_venue_distribution['2-3km']; }
    }
    if (data.esports_venue_distribution?.['备注']) {
        const elem = document.getElementById('venue_remarks');
        if (elem) { elem.value = data.esports_venue_distribution['备注']; }
    }

    // 清空并重建电竞酒店列表
    const esportsHotelContainer = document.getElementById('esports-hotels-container');
    if (esportsHotelContainer && data.esports_hotel_distribution && data.esports_hotel_distribution.length > 0) {
        try {
            esportsHotelContainer.innerHTML = '';
            esportsHotelsCount = 0;
            
            console.log(`准备添加 ${data.esports_hotel_distribution.length} 个电竞酒店`);
            data.esports_hotel_distribution.forEach((hotel, index) => {
                addEsportsHotel();
                const curIdx = esportsHotelsCount;
                const nameElem = document.getElementById(`esports_hotel_name_${curIdx}`);
                const distElem = document.getElementById(`esports_hotel_distance_${curIdx}`);
                const roomsElem = document.getElementById(`esports_hotel_rooms_${curIdx}`);
                const priceElem = document.getElementById(`esports_hotel_price_range_${curIdx}`);
                const gradeElem = document.getElementById(`esports_hotel_grade_${curIdx}`);
                
                if (nameElem) nameElem.value = hotel.name || '';
                if (distElem) distElem.value = hotel.distance || '';
                if (roomsElem) roomsElem.value = hotel.rooms || '';
                if (priceElem) priceElem.value = hotel.price_range || '';
                if (gradeElem) gradeElem.value = hotel.grade || '';
                
                console.log(`✓ 电竞酒店${index + 1}已添加:`, hotel);
            });
        } catch (error) {
            console.error('电竞酒店列表填充失败:', error);
        }
    }
    
    // 清空并重建商务酒店列表
    const businessHotelContainer = document.getElementById('business-hotels-container');
    if (businessHotelContainer && data.business_hotel_distribution && data.business_hotel_distribution.length > 0) {
        try {
            businessHotelContainer.innerHTML = '';
            businessHotelsCount = 0;
            
            console.log(`准备添加 ${data.business_hotel_distribution.length} 个商务酒店`);
            data.business_hotel_distribution.forEach((hotel, index) => {
                addBusinessHotel();
                const curIdx = businessHotelsCount;
                const nameElem = document.getElementById(`business_hotel_name_${curIdx}`);
                const distElem = document.getElementById(`business_hotel_distance_${curIdx}`);
                const roomsElem = document.getElementById(`business_hotel_rooms_${curIdx}`);
                const priceElem = document.getElementById(`business_hotel_price_range_${curIdx}`);
                const gradeElem = document.getElementById(`business_hotel_grade_${curIdx}`);
                
                if (nameElem) nameElem.value = hotel.name || '';
                if (distElem) distElem.value = hotel.distance || '';
                if (roomsElem) roomsElem.value = hotel.rooms || '';
                if (priceElem) priceElem.value = hotel.price_range || '';
                if (gradeElem) gradeElem.value = hotel.grade || '';
                
                console.log(`✓ 商务酒店${index + 1}已添加:`, hotel);
            });
        } catch (error) {
            console.error('商务酒店列表填充失败:', error);
        }
    }
    
    // 保存草稿
    saveAssessmentDraft();
    
    console.log('表单填充完成', data);
}
