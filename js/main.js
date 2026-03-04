// ==========================================
// Loading Screen
// ==========================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 800);
    }
});

// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        }
    });
}

// ==========================================
// Back to Top Button
// ==========================================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard support (Enter key)
    backToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// 平滑滚动（用视口坐标计算，避免嵌套导致 offsetTop 不准）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const selector = this.getAttribute('href');
        if (selector === '#') return;
        const target = document.querySelector(selector);
        if (target) {
            const navHeight = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset;
            const targetPosition = top - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 导航栏滚动效果
let lastScroll = 0;
const navbar = document.querySelector('.nav-bar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// 创建电竞产业趋势图表 - 优化版
function createEsportsChart() {
    const ctx = document.getElementById('esportsChart');
    if (!ctx) {
        console.warn('Chart canvas not found: esportsChart');
        return;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    try {
        const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
        const revenue = [238.5, 254.3, 267.8, 275.7, 283.9, 293.31];
        const users = [4.44, 4.59, 4.72, 4.82, 4.89, 4.95];

        // 创建渐变色
        const revenueGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        revenueGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        revenueGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        revenueGradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        const usersGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        usersGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        usersGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
        usersGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '产业收入',
                    data: revenue,
                    borderColor: '#6366f1',
                    backgroundColor: revenueGradient,
                    borderWidth: 4,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 7,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#6366f1',
                    pointHoverBorderWidth: 4,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: '用户规模',
                    data: users,
                    borderColor: '#10b981',
                    backgroundColor: usersGradient,
                    borderWidth: 4,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 7,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#10b981',
                    pointHoverBorderWidth: 4,
                    yAxisID: 'y1',
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 25,
                        font: {
                            size: 15,
                            family: "'Inter', 'Noto Sans SC', sans-serif",
                            weight: '700'
                        },
                        color: 'rgba(255, 255, 255, 0.95)',
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(17, 24, 39, 0.98)',
                    padding: 20,
                    titleFont: {
                        size: 16,
                        weight: '700',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        weight: '600',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    cornerRadius: 16,
                    displayColors: true,
                    boxPadding: 10,
                    boxWidth: 20,
                    boxHeight: 20,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    caretSize: 8,
                    caretPadding: 10,
                    callbacks: {
                        title: function(context) {
                            return `${context[0].label}年`;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.datasetIndex === 0) {
                                    label += context.parsed.y + ' 亿元';
                                    const prevValue = context.dataIndex > 0 ? revenue[context.dataIndex - 1] : revenue[0];
                                    const growth = ((context.parsed.y - prevValue) / prevValue * 100).toFixed(2);
                                    if (context.dataIndex > 0) {
                                        label += ` (${growth > 0 ? '+' : ''}${growth}%)`;
                                    }
                                } else {
                                    label += context.parsed.y + ' 亿人';
                                    const prevValue = context.dataIndex > 0 ? users[context.dataIndex - 1] : users[0];
                                    const growth = ((context.parsed.y - prevValue) / prevValue * 100).toFixed(2);
                                    if (context.dataIndex > 0) {
                                        label += ` (${growth > 0 ? '+' : ''}${growth}%)`;
                                    }
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '产业收入 (亿元)',
                        font: {
                            size: 14,
                            family: "'Inter', 'Noto Sans SC', sans-serif",
                            weight: '700'
                        },
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: {top: 0, bottom: 10}
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: 10,
                        callback: function(value) {
                            return value + '亿';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
                        drawBorder: false,
                        lineWidth: 1
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '用户规模 (亿人)',
                        font: {
                            size: 14,
                            family: "'Inter', 'Noto Sans SC', sans-serif",
                            weight: '700'
                        },
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: {top: 0, bottom: 10}
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: 10,
                        callback: function(value) {
                            return value + '亿';
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: {
                            size: 14,
                            weight: '700'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        lineWidth: 1
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    } catch (error) {
        console.error('Error creating esports chart:', error);
    }
}

// 创建投资成本分解图表 - 优化版（无图例）
function createInvestmentChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) {
        console.warn('Chart canvas not found: investmentChart');
        return;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    try {
        const investmentData = {
        labels: ['电竞设备投入', '加盟成本', '装修投入', '其他费用'],
        data: [35.64, 8.8, 5.88, 0.35],
        colors: [
            '#6366f1', // 紫色 - 电竞设备（最大投入）
            '#f59e0b', // 橙色 - 加盟成本
            '#10b981', // 绿色 - 装修投入
            '#8b5cf6'  // 淡紫 - 其他费用
        ],
        descriptions: [
            '设备28台+服务器+外设',
            '加盟费+设计费+指导费',
            '弱电改造+主题房+前台',
            'OTA铺排+串流系统'
        ]
    };

    // 计算百分比
    const total = investmentData.data.reduce((a, b) => a + b, 0);
    const percentages = investmentData.data.map(val => ((val / total) * 100).toFixed(1));

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: investmentData.labels,
            datasets: [{
                data: investmentData.data,
                backgroundColor: investmentData.colors.map(color => color + '30'),
                borderColor: investmentData.colors,
                borderWidth: 4,
                hoverOffset: 20,
                hoverBorderWidth: 5,
                spacing: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 20
            },
            plugins: {
                legend: {
                    display: false // 隐藏默认图例
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(17, 24, 39, 0.98)',
                    padding: 20,
                    titleFont: {
                        size: 16,
                        weight: '700',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        weight: '500',
                        family: "'Inter', 'Noto Sans SC', sans-serif",
                        lineHeight: 1.8
                    },
                    footerFont: {
                        size: 13,
                        weight: '600',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    cornerRadius: 16,
                    displayColors: true,
                    boxPadding: 10,
                    boxWidth: 20,
                    boxHeight: 20,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    caretSize: 8,
                    caretPadding: 10,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = percentages[context.dataIndex];
                            const desc = investmentData.descriptions[context.dataIndex];
                            return [
                                `投资金额: ${value}万元`,
                                `占比: ${percentage}%`,
                                `说明: ${desc}`
                            ];
                        },
                        footer: function(context) {
                            return `\n总投资: ${total.toFixed(2)}万元`;
                        }
                    }
                }
            },
            cutout: '65%',
            radius: '90%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();

                const centerX = width / 2;
                const centerY = height / 2;

                // 绘制中心文字 - 总金额
                ctx.font = `900 ${Math.min(width, height) / 8}px 'Inter', sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.fillText(`${total.toFixed(2)}`, centerX, centerY - 20);

                // 绘制单位
                ctx.font = `600 ${Math.min(width, height) / 16}px 'Inter', sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillText('万元', centerX, centerY + 20);

                // 绘制标签
                ctx.font = `500 ${Math.min(width, height) / 20}px 'Inter', sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.fillText('总投资', centerX, centerY + 50);

                ctx.save();
            }
        }]
    });
    } catch (error) {
        console.error('Error creating investment chart:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Chart.js to load before creating charts
    if (typeof Chart !== 'undefined') {
        createEsportsChart();
        createInvestmentChart();
    } else {
        console.warn('Chart.js not loaded yet, retrying...');
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                createEsportsChart();
                createInvestmentChart();
            } else {
                console.error('Failed to load Chart.js library');
            }
        }, 1000);
    }
    
    createParticles();
    
    // Initialize calculator
    if (typeof calculate === 'function') {
        calculate();
    }
});

// 创建漂浮粒子效果
// 创建闪烁的漂浮粒子效果
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        console.warn('Particles container not found');
        return;
    }
    
    const particleCount = 60; // 增加粒子数量
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小 (2-5px)
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 随机水平位置
        particle.style.left = `${Math.random() * 100}%`;
        
        // 随机动画时长 (15-30秒)
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;
        
        // 随机延迟
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    console.log(`Created ${particleCount} twinkling particles`);
}

// 鼠标移动视差效果
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const glowOrbs = document.querySelectorAll('.glow-orb');
    glowOrbs.forEach((orb, index) => {
        const speed = (index + 1) * 10;
        const x = mouseX * speed;
        const y = mouseY * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// 观察器用于触发滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.stat-card, .esports-card, .chart-card, .financial-table-wrapper').forEach(el => {
    observer.observe(el);
});

// 数字递增动画
function animateValue(element, start, end, duration, decimals = 2) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.textContent = value.toFixed(decimals);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 为统计数字添加递增动画
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const number = entry.target;
            const targetValue = parseFloat(number.textContent.replace(',', ''));
            const decimals = number.textContent.includes('.') ? 2 : 0;
            animateValue(number, 0, targetValue, 2000, decimals);
        }
    });
}, { threshold: 0.5 });

// 观察所有数字元素
setTimeout(() => {
    document.querySelectorAll('.stat-number, .esports-number').forEach(el => {
        statObserver.observe(el);
    });
}, 500);

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: 滚动到顶部
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

console.log('%c电竞酒店可行性研究报告 %c已加载完成 ✓', 
    'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #10b981; color: white; padding: 8px 16px; border-radius: 0 4px 4px 0; font-weight: bold;'
);

// ==========================================
// 财务计算器功能
// ==========================================

// 默认值（滴灌通投资模型）
const defaultValues = {
    roomCount: 100,
    occupancyRate: 100,
    avgPrice: 200,
    profitShareRate: 10,
    deviceCount: 100,
    equipmentCost: 100,
    expectedReturn: 18
};

// 计算财务指标
function calculate() {
    console.log('Calculate function called'); // 调试：确认函数被调用
    
    // 第一部分：核心输入
    const roomCount = parseFloat(document.getElementById('roomCount')?.value || 0);
    const occupancyRate = parseFloat(document.getElementById('occupancyRate')?.value || 0) / 100;
    const avgPrice = parseFloat(document.getElementById('avgPrice')?.value || 0);
    const otaRate = parseFloat(document.getElementById('otaRate')?.value || 9) / 100;
    const profitShareRate = parseFloat(document.getElementById('profitShareRate')?.value || 0) / 100;
    
    // 计算 RevPAR = ADR × OCC × (1 - OTA比例)
    const revpar = avgPrice * occupancyRate * (1 - otaRate);
    
    console.log('DEBUG - RevPAR Calculation:', {
        avgPrice,
        occupancyRate,
        otaRate,
        revpar
    }); // 调试：显示 RevPAR 计算过程
    
    // 第二部分：设备投资
    const equipmentCost = parseFloat(document.getElementById('equipmentCost')?.value || 0); // 万元
    const totalRenovationCost = parseFloat(document.getElementById('totalRenovationCost')?.value || 0); // 万元
    
    // 计算电竞占总改造比例
    const equipmentRatio = totalRenovationCost > 0 ? (equipmentCost / totalRenovationCost * 100) : 0;
    
    // 更新只读的比例显示字段
    const equipmentRatioCalcInput = document.getElementById('equipmentRatioCalc');
    if (equipmentRatioCalcInput) {
        equipmentRatioCalcInput.value = equipmentRatio.toFixed(1);
    }
    
    // 第三部分：投资核心指标参数
    const annualReturn = parseFloat(document.getElementById('expectedReturn')?.value || 18) / 100;
    const irrFrequency = document.getElementById('irrFrequency')?.value || 'daily';
    
    // 始终使用 MIRR（修正内部收益率），再投资率使用预期年收益率
    const reinvestmentRate = annualReturn;
    
    // 计算月收益率（从年收益率转换）
    const monthlyReturn = annualReturn / 12;
    
    // 计算 PCF（滴灌通分成预期现金流）- 元/天
    // PCF = 房间数量 × RevPAR × 分成比例
    // 其中 RevPAR = ADR × OCC × (1 - OTA比例)
    const pcfDaily = roomCount * revpar * profitShareRate;
    
    // 计算月PCF（元/月）
    const pcfMonthly = pcfDaily * 30;
    
    // 计算总投资额（使用改造总投入）
    const totalInvestment = totalRenovationCost;
    const totalInvestmentYuan = totalInvestment * 10000; // 转换为元
    
    // === 投资核心指标计算 ===
    
    // 1. 计算YITO期限（需要先算，因为ROI和IRR都依赖它）
    // 日PCF × T = 总投资额 × (1 + 日r × T)
    // T = 总投资额 / (日PCF - 总投资额 × 日r)
    const dailyReturn = annualReturn / 365; // 日收益率
    const yitoPeriodDays = (pcfDaily - totalInvestmentYuan * dailyReturn) > 0 
        ? Math.round(totalInvestmentYuan / (pcfDaily - totalInvestmentYuan * dailyReturn))
        : 0;
    
    // 为了兼容性，也计算月数（用于显示参考）
    const yitoPeriodMonths = yitoPeriodDays / 30;
    
    // 2. 目标回收总额
    // 目标回收总额 = 日PCF × YITO期限
    const targetRecovery = pcfDaily * yitoPeriodDays;
    
    // 3. ROI（投资回报倍数）
    // ROI = 目标回收总额 / 总投资额
    const roi = totalInvestmentYuan > 0 ? targetRecovery / totalInvestmentYuan : 0;
    
    // 4. IRR - 根据选择的分账频率计算（年限 = 联营期限 YITO，由模型推导，非固定值）
    
    let irrValue = 0;
    let irrLabel = '';
    let irrFormula = '';
    
    // 根据分账频率设置标签
    if (irrFrequency === 'daily') {
        irrLabel = 'IRR（考虑复投）';
        irrFormula = '每日回收按预期收益率复投计算';
    } else if (irrFrequency === 'weekly') {
        irrLabel = 'IRR（考虑复投）';
        irrFormula = '每周回收按预期收益率复投计算';
    } else if (irrFrequency === 'biweekly') {
        irrLabel = 'IRR（考虑复投）';
        irrFormula = '每两周回收按预期收益率复投计算';
    }
    
    // 根据分账频率构造现金流
    let cashFlows = [];
    if (irrFrequency === 'daily') {
        cashFlows = buildYitoDailyCashFlows(yitoPeriodDays, pcfDaily);
    } else if (irrFrequency === 'weekly') {
        cashFlows = buildYitoWeeklyCashFlows(yitoPeriodDays, pcfDaily);
    } else if (irrFrequency === 'biweekly') {
        cashFlows = buildYitoBiweeklyCashFlows(yitoPeriodDays, pcfDaily);
    }
    
    const irrAnnualDecimal = cashFlows.length > 0
        ? calculateMIRR(totalInvestmentYuan, cashFlows, reinvestmentRate, 365)
        : NaN;
    irrValue = (typeof irrAnnualDecimal === 'number' && !isNaN(irrAnnualDecimal)) ? irrAnnualDecimal * 100 : 0;

    // 顶部卡片「IRR（日分账）」：用按年贴现的IRR，避免 period 过大导致指数爆炸
    let dailyIRRDisplay = '--';
    if (yitoPeriodDays > 0 && pcfDaily > 0) {
        const dailyCashFlowsForCard = buildYitoDailyCashFlows(yitoPeriodDays, pcfDaily);
        const irrAnnual = calculateMIRR(totalInvestmentYuan, dailyCashFlowsForCard, annualReturn, 365);
        if (typeof irrAnnual === 'number' && !isNaN(irrAnnual) && isFinite(irrAnnual)) {
            dailyIRRDisplay = formatNumberWithDecimals(irrAnnual * 100, 2);
        }
    }
    
    // 调试输出
    console.log('=== 滴灌通投资模型 ===');
    console.log('第一部分：核心输入估计PCF');
    console.log('- 房间数量:', roomCount, '间');
    console.log('- 入住率:', (occupancyRate * 100).toFixed(2), '%');
    console.log('- 平均房价 ADR:', avgPrice, '元/间/天');
    console.log('- OTA比例:', (otaRate * 100).toFixed(1), '%');
    console.log('- RevPAR:', revpar.toFixed(2), '元/间/天');
    console.log('- 分成比例:', (profitShareRate * 100).toFixed(2), '%');
    console.log('- PCF(日):', pcfDaily.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), '元/天');
    console.log('- PCF(月):', pcfMonthly.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), '元/月');
    console.log('');
    console.log('第二部分：设备投资');
    console.log('- 电竞设备投入:', equipmentCost, '万元');
    console.log('- 改造总投入:', totalRenovationCost, '万元');
    console.log('- 电竞占总改造比例:', equipmentRatio.toFixed(1), '%');
    console.log('- 总投资额:', totalInvestment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), '万元');
    console.log('');
    console.log('第三部分：投资核心指标');
    console.log('- 预期年收益率:', (annualReturn * 100).toFixed(2), '%');
    console.log('- 预期日收益率:', (dailyReturn * 100).toFixed(6), '%');
    console.log('- 预期月收益率:', (monthlyReturn * 100).toFixed(4), '%');
    console.log('- YITO期限（联营期限）:', yitoPeriodDays, '天 (', yitoPeriodMonths.toFixed(2), '个月)');
    console.log('- 目标回收总额:', targetRecovery.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), '元');
    console.log('- ROI:', roi.toFixed(2), '倍');
    console.log('- IRR分账频率:', irrFrequency);
    console.log('- 使用 IRR（考虑复投）- 再投资率:', (annualReturn * 100).toFixed(2) + '%');
    console.log('- 现金流笔数:', cashFlows.length, '笔');
    console.log('- IRR(年化):', irrValue.toFixed(2), '%');
    
    // 更新显示（含关键指标卡片中的 IRR 日分账）
    updateDisplay({
        revparResult: formatNumberWithDecimals(revpar, 2),
        pcfResult: formatNumberWithDecimals(pcfDaily, 2),
        equipmentRatioDisplay: formatNumberWithDecimals(equipmentRatio, 1),
        totalInvestment2: formatNumberWithDecimals(totalInvestment, 2),
        targetRecoveryResult: formatNumber(Math.round(targetRecovery)),
        roiResult: formatNumberWithDecimals(roi, 2),
        irrResult: formatNumberWithDecimals(irrValue, 2),
        irrLabel: irrLabel,
        irrFormula: irrFormula,
        yitoResult: formatNumber(yitoPeriodDays),
        yitoResultMonths: formatNumberWithDecimals(yitoPeriodMonths, 1),
        dailyIRR: dailyIRRDisplay
    });
}

// 计算IRR（内部回报率）使用牛顿迭代法
function calculateIRR(initialInvestment, cashFlow, periods) {
    // 边界检查
    if (initialInvestment <= 0 || cashFlow <= 0 || periods <= 0) {
        return 0;
    }
    
    // 初始猜测值
    let irr = 0.1; // 10%
    const maxIterations = 100;
    const tolerance = 0.0001;
    
    for (let i = 0; i < maxIterations; i++) {
        let npv = -initialInvestment;
        let derivative = 0;
        
        // 计算NPV和导数
        for (let t = 1; t <= periods; t++) {
            const factor = Math.pow(1 + irr, t);
            npv += cashFlow / factor;
            derivative -= t * cashFlow / Math.pow(1 + irr, t + 1);
        }
        
        // 检查导数是否太小
        if (Math.abs(derivative) < 0.000001) {
            console.warn('IRR计算：导数太小，可能无法收敛');
            break;
        }
        
        // 牛顿迭代
        const irrNew = irr - npv / derivative;
        
        // 检查收敛
        if (Math.abs(irrNew - irr) < tolerance) {
            return irrNew * 100; // 转换为百分比
        }
        
        irr = irrNew;
        
        // 防止负值或极端值
        if (irr < -0.99) irr = -0.99;
        if (irr > 10) irr = 10;
    }
    
    console.warn('IRR计算：未在最大迭代次数内收敛，返回当前值');
    return irr * 100; // 转换为百分比
}

// 格式化数字，添加千分位（整数）
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

// 格式化数字，添加千分位和指定小数位数（无效数统一显示为 --，避免出现 NaN）
function formatNumberWithDecimals(num, decimals) {
    if (num == null || typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
        return '--';
    }
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// 更新显示
function updateDisplay(values) {
    console.log('UpdateDisplay called with values:', values); // 调试：显示传入的值
    
    // 更新第一部分计算结果
    const revparElement = document.getElementById('revparResult');
    if (revparElement) {
        revparElement.textContent = values.revparResult;
        console.log('RevPAR updated to:', values.revparResult); // 调试：确认更新
    } else {
        console.error('revparResult element not found!'); // 调试：元素未找到
    }
    
    const pcfElement = document.getElementById('pcfResult');
    if (pcfElement) {
        pcfElement.textContent = values.pcfResult;
    }
    
    // 更新第二部分计算结果
    const equipmentRatioElement = document.getElementById('equipmentRatioDisplay');
    if (equipmentRatioElement) {
        equipmentRatioElement.textContent = values.equipmentRatioDisplay;
    }
    
    const totalInvElement = document.getElementById('totalInvestment2');
    if (totalInvElement) {
        totalInvElement.textContent = values.totalInvestment2;
    }
    
    // 更新第三部分投资核心指标
    const yitoElement = document.getElementById('yitoResult');
    if (yitoElement) {
        yitoElement.textContent = values.yitoResult;
    }
    
    const yitoMonthsElement = document.getElementById('yitoResultMonths');
    if (yitoMonthsElement) {
        yitoMonthsElement.textContent = values.yitoResultMonths;
    }
    
    const targetRecoveryElement = document.getElementById('targetRecoveryResult');
    if (targetRecoveryElement) {
        targetRecoveryElement.textContent = values.targetRecoveryResult;
    }
    
    const roiElement = document.getElementById('roiResult');
    if (roiElement) {
        roiElement.textContent = values.roiResult;
    }
    
    const irrElement = document.getElementById('irrResult');
    if (irrElement) {
        irrElement.textContent = values.irrResult;
    }
    
    const irrLabelElement = document.getElementById('irrLabel');
    if (irrLabelElement) {
        irrLabelElement.textContent = values.irrLabel;
    }
    
    const irrFormulaElement = document.getElementById('irrFormula');
    if (irrFormulaElement) {
        irrFormulaElement.textContent = values.irrFormula;
    }

    const dailyIRRElement = document.getElementById('dailyIRR');
    if (dailyIRRElement && values.dailyIRR !== undefined) {
        dailyIRRElement.textContent = values.dailyIRR;
    }
}

// 重置为默认值
function resetCalculator() {
    Object.keys(defaultValues).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = defaultValues[key];
        }
    });
    calculate();
    
    // 添加重置动画
    const calculator = document.querySelector('.calculator-section');
    calculator.style.animation = 'none';
    setTimeout(() => {
        calculator.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

// 页面加载时初始化计算（calculate 内部会调用 calculateDailyIRR 更新日分账卡片）
window.addEventListener('DOMContentLoaded', () => {
    calculate();
});

// ==========================================
// IRR计算核心函数（防指数爆炸：按年贴现，不用 (1+r)^天数）
// ==========================================

/**
 * 按 YITO 期限构造现金流（真实日分账）- 每天产生一笔现金流
 * @param {number} yitoPeriodDays - 联营期限总天数
 * @param {number} pcfDaily - 日 PCF 金额
 * @returns {Array<{days: number, amount: number}>}
 */
function buildYitoDailyCashFlows(yitoPeriodDays, pcfDaily) {
    const flows = [];
    // 每天产生一笔现金流
    for (let day = 1; day <= yitoPeriodDays; day++) {
        flows.push({ days: day, amount: pcfDaily });
    }
    return flows;
}

/**
 * 按 YITO 期限构造现金流（周聚合）- 用于周分账
 * @param {number} yitoPeriodDays - 联营期限总天数
 * @param {number} pcfDaily - 日 PCF 金额
 * @returns {Array<{days: number, amount: number}>}
 */
function buildYitoWeeklyCashFlows(yitoPeriodDays, pcfDaily) {
    const flows = [];
    const fullWeeks = Math.floor(yitoPeriodDays / 7);
    const remainderDays = yitoPeriodDays % 7;
    for (let week = 1; week <= fullWeeks; week++) {
        flows.push({ days: week * 7, amount: pcfDaily * 7 });
    }
    if (remainderDays > 0) {
        flows.push({ days: yitoPeriodDays, amount: pcfDaily * remainderDays });
    }
    return flows;
}

/**
 * 按 YITO 期限构造现金流（双周聚合）- 用于双周分账，防指数爆炸
 * @param {number} yitoPeriodDays - 联营期限总天数
 * @param {number} pcfDaily - 日 PCF 金额
 * @returns {Array<{days: number, amount: number}>}
 */
function buildYitoBiweeklyCashFlows(yitoPeriodDays, pcfDaily) {
    const flows = [];
    const periodDays = 14;
    const fullPeriods = Math.floor(yitoPeriodDays / periodDays);
    const remainderDays = yitoPeriodDays % periodDays;
    for (let p = 1; p <= fullPeriods; p++) {
        flows.push({ days: p * periodDays, amount: pcfDaily * periodDays });
    }
    if (remainderDays > 0) {
        flows.push({ days: yitoPeriodDays, amount: pcfDaily * remainderDays });
    }
    return flows;
}

/**
 * 计算以天数为单位的现金流IRR（内部收益率），直接返回年化IRR
 * 标准IRR计算，不考虑再投资（若需考虑再投资，请使用calculateMIRR）
 * @param {number} initialInvestment - 初始投资额（正数，代表现金流出）
 * @param {Array<Object>} cashFlowDetails - 现金流详情数组 [{days, amount}]
 * @param {number} [maxIterations=1000] - 最大迭代次数
 * @param {number} [tolerance=1e-8] - 收敛容差
 * @param {number} [daysPerYear=365] - 一年的计息天数
 * @returns {number} 年化IRR（小数形式，如0.18表示18%）
 */
function calculateIRRByDays(
    initialInvestment,
    cashFlowDetails,
    maxIterations = 1000,
    tolerance = 1e-8,
    daysPerYear = 365
) {
    // 参数校验
    if (
        typeof initialInvestment !== 'number' || initialInvestment <= 0 ||
        !Array.isArray(cashFlowDetails) || cashFlowDetails.length === 0 ||
        cashFlowDetails.some(item => typeof item.days !== 'number' || item.days <= 0 || typeof item.amount !== 'number' || item.amount <= 0)
    ) {
        console.error('参数错误：初始投资额和现金流必须有效');
        return NaN;
    }

    // 预处理现金流——天数转年数
    const cashFlowsWithYears = cashFlowDetails.map(flow => ({
        years: flow.days / daysPerYear,
        amount: flow.amount
    }));

    // 初始化牛顿迭代
    let irr = 0.1;

    // 牛顿-拉夫逊迭代求解IRR
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let npv = -initialInvestment;
        let derivative = 0;

        // 标准IRR计算
        for (const flow of cashFlowsWithYears) {
            const t = flow.years;
            const cashAmount = flow.amount;

            const logFactor = Math.log(1 + irr);
            const factor = Math.exp(t * logFactor);
            const derivativeFactor = Math.exp((t + 1) * logFactor);

            npv += cashAmount / factor;
            derivative -= (t * cashAmount) / derivativeFactor;
        }

        // 保护机制：避免导数过小导致除以0，中断迭代
        if (Math.abs(derivative) < 1e-10) {
            console.warn('IRR计算警告：导数过小，无法继续迭代（可能无有效正收益解或现金流配置不合理）');
            break;
        }

        // 牛顿迭代核心公式：更新irr值
        const irrNew = irr - npv / derivative;

        // 完善收敛条件：同时验证「irr差值」和「NPV接近0」，保证结果准确性
        const irrDifference = Math.abs(irrNew - irr);
        const npvNearZero = Math.abs(npv) < 1e-6;
        if (irrDifference < tolerance && npvNearZero) {
            // 返回保留6位小数的年化IRR，提升可读性和实用性
            return parseFloat(irrNew.toFixed(6));
        }

        // 边界限制：避免irr出现极端值，防止迭代发散
        if (irrNew < -0.99) {
            irr = -0.99; // 下限：-99%年化（避免分母为0）
        } else if (irrNew > 10) {
            irr = 10; // 上限：1000%年化（覆盖绝大多数超高收益场景）
        } else {
            irr = irrNew;
        }
    }

    // 迭代未收敛：返回当前最优值（保留6位小数），并给出警告
    console.warn('IRR计算警告：未在最大迭代次数内完全收敛，返回当前最优年化IRR');
    return parseFloat(irr.toFixed(6));
}

// ==========================================
// 日分账IRR计算（显示在关键指标卡片中）
// 年限 = YITO 期限（联营期限），由「月PCF 与 预期月收益率」推导，非固定值
// ==========================================

/**
 * 计算日分账年化IRR并更新顶部卡片。
 * 回收期与现金流年限均按「联营期限 YITO」定义：
 *   YITO（月）= 总投资额 / (月PCF - 总投资额×月预期收益率)
 *   YITO（天）= YITO（月）× 30
 * 日分账：在联营期限内的每一天收到一笔 PCF，求 NPV=0 的日利率并年化。
 */
function calculateDailyIRR() {
    const roomCount = parseFloat(document.getElementById('roomCount')?.value) || 100;
    const occupancyRate = (parseFloat(document.getElementById('occupancyRate')?.value) / 100) || 1;
    const avgPrice = parseFloat(document.getElementById('avgPrice')?.value) || 200;
    const profitShareRate = (parseFloat(document.getElementById('profitShareRate')?.value) / 100) || 0.10;
    const equipmentCost = parseFloat(document.getElementById('equipmentCost')?.value) || 100;
    const annualReturn = (parseFloat(document.getElementById('expectedReturn')?.value) / 100) || 0.18;

    const pcfDaily = roomCount * occupancyRate * avgPrice * profitShareRate;
    const totalInvestmentYuan = equipmentCost * 10000;
    const dailyReturn = annualReturn / 365;

    // 联营期限（YITO）：日PCF × T = 总投资 × (1 + 日r×T) => T = 总投资 / (日PCF - 总投资×日r)
    const yitoPeriodDays = (pcfDaily - totalInvestmentYuan * dailyReturn) > 0
        ? Math.round(totalInvestmentYuan / (pcfDaily - totalInvestmentYuan * dailyReturn))
        : 0;

    if (yitoPeriodDays <= 0 || pcfDaily <= 0) {
        const el = document.getElementById('dailyIRR');
        if (el) el.textContent = '--';
        return;
    }

    // 按 YITO 期限构造现金流（真实日分账，每天一笔）
    const cashFlows = buildYitoDailyCashFlows(yitoPeriodDays, pcfDaily);

    // 始终使用 MIRR
    const irrAnnual = calculateMIRR(totalInvestmentYuan, cashFlows, annualReturn, 365);

    const dailyIRRElement = document.getElementById('dailyIRR');
    if (dailyIRRElement) {
        dailyIRRElement.textContent = formatNumberWithDecimals(irrAnnual * 100, 2);
    }
}

// ==========================================
// MIRR (Modified Internal Rate of Return) 计算
// 修正内部收益率 - 考虑再投资收益率
// ==========================================

/**
 * 计算MIRR（修正内部收益率）- 考虑现金流再投资
 * @param {number} initialInvestment - 初始投资额（正数）
 * @param {Array<Object>} cashFlowDetails - 现金流详情 [{days, amount}]
 * @param {number} reinvestmentRate - 再投资收益率（年化，小数形式，如0.18表示18%）
 * @param {number} daysPerYear - 一年的天数（默认365）
 * @returns {number} MIRR（年化，小数形式）
 */
function calculateMIRR(initialInvestment, cashFlowDetails, reinvestmentRate, daysPerYear = 365) {
    if (initialInvestment <= 0 || !cashFlowDetails || cashFlowDetails.length === 0) {
        return NaN;
    }
    
    // 获取项目总期限（最后一笔现金流的时间）
    const maxDays = Math.max(...cashFlowDetails.map(f => f.days));
    const maxYears = maxDays / daysPerYear;
    
    // 计算所有现金流入按再投资率复利到期末的终值（FV）
    let futureValue = 0;
    for (const flow of cashFlowDetails) {
        const t = flow.days / daysPerYear; // 该笔现金流发生的时间（年）
        const remainingYears = maxYears - t; // 剩余可复投的时间
        
        // 该笔现金流按再投资率复利到期末的终值
        const fv = flow.amount * Math.pow(1 + reinvestmentRate, remainingYears);
        futureValue += fv;
    }
    
    // MIRR公式：(FV / PV)^(1/n) - 1
    // 其中：FV = 所有现金流入的终值总和
    //      PV = 初始投资（现值）
    //      n = 项目期限（年）
    const mirr = Math.pow(futureValue / initialInvestment, 1 / maxYears) - 1;
    
    return mirr;
}

// ==========================================
// 项目评估系统
// ==========================================

// 案例数据库
const benchmarkCases = [
    {
        name: "浙江人民广场店",
        location: "core",
        type: "连锁酒店",
        rooms: 30,
        beforePrice: 200,
        beforeOccupancy: 60,
        afterPrice: 300,
        afterOccupancy: 95,
        investment: 80,
        payback: 5,
        roi: 275
    },
    {
        name: "华东全新电竞店",
        location: "development",
        type: "全新酒店",
        rooms: 40,
        beforePrice: 180,
        beforeOccupancy: 60,
        afterPrice: 280,
        afterOccupancy: 90,
        investment: 250,
        payback: 36,
        roi: 88
    },
    {
        name: "华东商务酒店",
        location: "development",
        type: "商务酒店",
        rooms: 20,
        beforePrice: 160,
        beforeOccupancy: 60,
        afterPrice: 240,
        afterOccupancy: 92,
        investment: 35,
        payback: 6,
        roi: 257
    },
    {
        name: "华东存量酒店",
        location: "integration",
        type: "存量改造",
        rooms: 40,
        beforePrice: 150,
        beforeOccupancy: 50,
        afterPrice: 210,
        afterOccupancy: 75,
        investment: 100,
        payback: 6,
        roi: 90
    }
];

// 区域评级数据
const locationRatings = {
    core: { name: "核心商圈", score: 25, priceMultiplier: 1.5, occupancyBonus: 35 },
    development: { name: "城市开发区", score: 20, priceMultiplier: 1.35, occupancyBonus: 30 },
    integration: { name: "产城融合区", score: 18, priceMultiplier: 1.25, occupancyBonus: 25 },
    scenic: { name: "景区周边", score: 22, priceMultiplier: 1.4, occupancyBonus: 30 }
};

// 改造方案定位评级
const gpuRatings = {
    high: { name: "旗舰版（RTX5070+ | 单房3.5万+）", score: 20, budgetMin: 35000, budgetMax: 50000 },
    mid: { name: "标准版（RTX5060Ti/5070 | 单房2.5-3.5万）", score: 18, budgetMin: 25000, budgetMax: 35000 },
    entry: { name: "经济版（RTX5060 | 单房2-2.5万）", score: 15, budgetMin: 20000, budgetMax: 25000 }
};

// 初始化评估系统
document.addEventListener('DOMContentLoaded', function() {
    const evaluateBtn = document.getElementById('evaluateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (evaluateBtn) {
        evaluateBtn.addEventListener('click', evaluateProject);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetEvaluationForm);
    }
});

// 评估项目函数
function evaluateProject() {
    // 获取表单数据
    const formData = {
        name: document.getElementById('projectName').value,
        location: document.getElementById('projectLocation').value,
        hotelType: document.getElementById('hotelType').value,
        totalRooms: parseInt(document.getElementById('totalRooms').value) || 0,
        renovationRooms: parseInt(document.getElementById('renovationRooms').value) || 0,
        beforePrice: parseFloat(document.getElementById('beforePrice').value) || 0,
        beforeOccupancy: parseFloat(document.getElementById('beforeOccupancy').value) || 0,
        beforeRevenue: parseFloat(document.getElementById('beforeRevenue').value) || 0,
        budget: parseFloat(document.getElementById('renovationBudget').value) || 0,
        equipmentRatio: parseFloat(document.getElementById('equipmentRatio').value) || 0,
        targetPrice: parseFloat(document.getElementById('targetPrice').value) || 0,
        targetOccupancy: parseFloat(document.getElementById('targetOccupancy').value) || 0,
        gpuLevel: document.getElementById('gpuLevel').value
    };
    
    // 验证必填字段
    if (!formData.name || !formData.location || !formData.hotelType || 
        formData.totalRooms === 0 || formData.renovationRooms === 0 ||
        formData.beforePrice === 0 || formData.beforeOccupancy === 0 ||
        formData.budget === 0 || formData.targetPrice === 0 || 
        formData.targetOccupancy === 0 || !formData.gpuLevel) {
        alert('请填写所有必填字段！');
        return false;
    }
    
    // 执行评估计算
    const evaluation = calculateEvaluation(formData);
    
    // 显示评估结果
    displayEvaluationResults(evaluation, formData);
    
    // 保存到历史记录
    saveToHistory(formData, evaluation);
    
    // 返回评估结果
    return { formData, evaluation };
}

// 计算评估分数
function calculateEvaluation(data) {
    const result = {
        finance: 0,
        market: 0,
        payback: 0,
        risk: 0,
        overall: 0,
        details: {}
    };
    
    // 1. 财务收益评分（30分）
    const projectedMonthlyRevenue = data.renovationRooms * data.targetPrice * (data.targetOccupancy / 100) * 30;
    const projectedYearlyRevenue = projectedMonthlyRevenue * 12 / 10000; // 万元
    const projectedProfit = projectedYearlyRevenue * 0.65; // 假设65%利润率
    const roi = (projectedProfit / data.budget) * 100;
    
    result.details.projectedRevenue = projectedYearlyRevenue.toFixed(2);
    result.details.projectedProfit = projectedProfit.toFixed(2);
    result.details.projectedROI = roi.toFixed(1);
    
    // ROI评分
    if (roi >= 200) result.finance = 30;
    else if (roi >= 150) result.finance = 25;
    else if (roi >= 100) result.finance = 20;
    else if (roi >= 80) result.finance = 15;
    else result.finance = 10;
    
    // 2. 市场潜力评分（25分）
    const locationInfo = locationRatings[data.location];
    result.market = locationInfo.score;
    
    const priceGrowth = ((data.targetPrice - data.beforePrice) / data.beforePrice * 100).toFixed(1);
    const occupancyGrowth = (data.targetOccupancy - data.beforeOccupancy).toFixed(1);
    
    result.details.locationRating = locationInfo.name;
    result.details.priceGrowth = priceGrowth;
    result.details.occupancyGrowth = occupancyGrowth;
    
    // 3. 回本周期评分（25分）
    const paybackMonths = (data.budget / projectedProfit * 12).toFixed(1);
    result.details.paybackPeriod = paybackMonths;
    
    if (paybackMonths <= 6) {
        result.payback = 25;
        result.details.paybackRating = "极快（≤6个月）";
    } else if (paybackMonths <= 10) {
        result.payback = 20;
        result.details.paybackRating = "较快（6-10个月）";
    } else if (paybackMonths <= 15) {
        result.payback = 15;
        result.details.paybackRating = "中等（10-15个月）";
    } else if (paybackMonths <= 24) {
        result.payback = 10;
        result.details.paybackRating = "较慢（15-24个月）";
    } else {
        result.payback = 5;
        result.details.paybackRating = "慢（>24个月）";
    }
    
    // 4. 风险控制评分（20分）
    const gpuInfo = gpuRatings[data.gpuLevel];
    let riskScore = gpuInfo.score;
    
    result.details.equipmentRating = gpuInfo.name;
    
    // 预算合理性检查 - 根据方案定位判断
    const budgetPerRoom = data.budget * 10000 / data.renovationRooms;
    const minBudget = gpuInfo.budgetMin;
    const maxBudget = gpuInfo.budgetMax;
    
    if (budgetPerRoom >= minBudget && budgetPerRoom <= maxBudget) {
        result.details.budgetRating = `合理（${(minBudget/10000).toFixed(1)}-${(maxBudget/10000).toFixed(1)}万/间）`;
    } else if (budgetPerRoom < minBudget) {
        result.details.budgetRating = `偏低（<${(minBudget/10000).toFixed(1)}万/间）`;
        riskScore -= 3;
    } else {
        result.details.budgetRating = `偏高（>${(maxBudget/10000).toFixed(1)}万/间）`;
        riskScore -= 1;
    }
    
    // 设备占比检查
    if (data.equipmentRatio >= 70 && data.equipmentRatio <= 80) {
        result.details.equipmentRatioRating = "优秀（70-80%）";
    } else if (data.equipmentRatio >= 60) {
        result.details.equipmentRatioRating = "良好（60-70%）";
        riskScore -= 2;
    } else {
        result.details.equipmentRatioRating = "不足（<60%）";
        riskScore -= 4;
    }
    
    result.risk = Math.max(0, riskScore);
    
    // 风险等级
    if (result.risk >= 18) result.details.riskLevel = "低风险";
    else if (result.risk >= 15) result.details.riskLevel = "中低风险";
    else if (result.risk >= 12) result.details.riskLevel = "中等风险";
    else result.details.riskLevel = "较高风险";
    
    // 5. 综合评分
    result.overall = result.finance + result.market + result.payback + result.risk;
    
    return result;
}

// 显示评估结果
function displayEvaluationResults(evaluation, formData) {
    const resultsDiv = document.getElementById('evaluationResults');
    if (!resultsDiv) return;
    
    // 显示结果区域
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // 1. 综合评分
    const overallScore = evaluation.overall;
    document.getElementById('overallScore').textContent = overallScore;
    
    // 更新圆环进度
    const circumference = 2 * Math.PI * 40; // r=40
    const offset = circumference - (overallScore / 100) * circumference;
    const progressRing = document.getElementById('scoreRingProgress');
    if (progressRing) {
        progressRing.style.strokeDashoffset = offset;
    }
    
    // 评级和描述
    const scoreLevel = document.getElementById('scoreLevel');
    const scoreDescription = document.getElementById('scoreDescription');
    
    if (overallScore >= 85) {
        scoreLevel.textContent = "优秀项目";
        scoreLevel.className = "score-level excellent";
        scoreDescription.textContent = "该项目投资价值极高，各项指标优秀，强烈推荐投资";
    } else if (overallScore >= 70) {
        scoreLevel.textContent = "良好项目";
        scoreLevel.className = "score-level good";
        scoreDescription.textContent = "该项目投资价值良好，综合指标较优，推荐投资";
    } else if (overallScore >= 55) {
        scoreLevel.textContent = "中等项目";
        scoreLevel.className = "score-level fair";
        scoreDescription.textContent = "该项目投资价值中等，部分指标需优化，谨慎投资";
    } else {
        scoreLevel.textContent = "需改进";
        scoreLevel.className = "score-level poor";
        scoreDescription.textContent = "该项目投资价值较低，多项指标不达标，不建议投资";
    }
    
    // 2. 详细指标
    document.getElementById('financeScore').textContent = evaluation.finance;
    document.getElementById('marketScore').textContent = evaluation.market;
    document.getElementById('paybackScore').textContent = evaluation.payback;
    document.getElementById('riskScore').textContent = evaluation.risk;
    
    document.getElementById('projectedRevenue').textContent = evaluation.details.projectedRevenue + '万元';
    document.getElementById('projectedProfit').textContent = evaluation.details.projectedProfit + '万元';
    document.getElementById('projectedROI').textContent = evaluation.details.projectedROI + '%';
    
    document.getElementById('locationRating').textContent = evaluation.details.locationRating;
    document.getElementById('priceGrowth').textContent = evaluation.details.priceGrowth + '%';
    document.getElementById('occupancyGrowth').textContent = evaluation.details.occupancyGrowth + '%';
    
    const paybackMonths = parseFloat(evaluation.details.paybackPeriod);
    const paybackDays = Math.round(paybackMonths * 30); // 转换为天数，1个月按30天计算
    const paybackDaysFormatted = paybackDays.toLocaleString('en-US'); // 添加千位分隔符
    document.getElementById('paybackPeriod').innerHTML = paybackMonths + '个月<br><span style="font-size: 0.9em; color: #94a3b8;">' + paybackDaysFormatted + '天</span>';
    document.getElementById('paybackRating').textContent = evaluation.details.paybackRating;
    
    document.getElementById('equipmentRating').textContent = evaluation.details.equipmentRating;
    document.getElementById('budgetRating').textContent = evaluation.details.budgetRating;
    document.getElementById('riskLevel').textContent = evaluation.details.riskLevel;
    
    // 3. 投资建议
    generateInvestmentAdvice(evaluation, formData);
    
    // 4. 对标案例
    generateBenchmarkCases(formData);
}

// 生成投资建议
function generateInvestmentAdvice(evaluation, formData) {
    const overallScore = evaluation.overall;
    const adviceOverall = document.getElementById('adviceOverall');
    const adviceStrengths = document.getElementById('adviceStrengths');
    const adviceRisks = document.getElementById('adviceRisks');
    const adviceOptimization = document.getElementById('adviceOptimization');
    
    // 综合评价
    if (overallScore >= 85) {
        adviceOverall.textContent = `${formData.name}是一个优质的电竞化改造项目。该项目在财务收益、市场潜力、回本速度和风险控制方面均表现优秀，具备极高的投资价值。建议立即启动项目，把握市场先机。`;
    } else if (overallScore >= 70) {
        adviceOverall.textContent = `${formData.name}是一个良好的电竞化改造项目。该项目综合指标较优，具备较高的投资价值。建议在优化部分细节后启动项目。`;
    } else if (overallScore >= 55) {
        adviceOverall.textContent = `${formData.name}是一个中等水平的电竞化改造项目。该项目部分指标需要优化提升，建议在完善方案后再考虑投资。`;
    } else {
        adviceOverall.textContent = `${formData.name}的电竞化改造方案需要重新评估。该项目多项指标不达标，建议优化改造方案或暂缓投资。`;
    }
    
    // 优势分析
    const strengths = [];
    if (evaluation.finance >= 25) {
        strengths.push(`财务收益优秀：预计年ROI达${evaluation.details.projectedROI}%，投资回报丰厚`);
    }
    if (evaluation.market >= 22) {
        strengths.push(`市场位置优越：位于${evaluation.details.locationRating}，客流量充沛，房价提升潜力${evaluation.details.priceGrowth}%`);
    }
    if (evaluation.payback >= 20) {
        strengths.push(`回本速度快：预计${evaluation.details.paybackPeriod}个月即可回本，资金周转效率高`);
    }
    if (evaluation.risk >= 18) {
        strengths.push(`风险可控：方案定位${evaluation.details.equipmentRating}，预算分配合理，${evaluation.details.riskLevel}`);
    }
    
    adviceStrengths.innerHTML = strengths.map(s => `<li>${s}</li>`).join('');
    
    // 风险提示
    const risks = [];
    if (evaluation.finance < 20) {
        risks.push(`投资回报率偏低（${evaluation.details.projectedROI}%），建议提升房价或入住率以改善收益`);
    }
    if (evaluation.market < 18) {
        risks.push(`区域市场竞争激烈或位置一般，需加强运营推广以提升入住率`);
    }
    if (evaluation.payback < 15) {
        risks.push(`回本周期较长（${evaluation.details.paybackPeriod}个月），对现金流要求较高，需确保资金充裕`);
    }
    if (evaluation.risk < 15) {
        risks.push(`${evaluation.details.riskLevel}，方案定位或预算分配可能存在问题，建议重新评估改造方案`);
    }
    if (formData.renovationRooms / formData.totalRooms < 0.5) {
        risks.push(`改造房间占比偏低（${(formData.renovationRooms / formData.totalRooms * 100).toFixed(0)}%），可能影响品牌效应和整体收益`);
    }
    
    if (risks.length === 0) {
        risks.push('该项目风险较低，各项指标均在合理范围内');
    }
    
    adviceRisks.innerHTML = risks.map(r => `<li>${r}</li>`).join('');
    
    // 优化建议
    const optimizations = [];
    if (parseFloat(evaluation.details.priceGrowth) < 40) {
        optimizations.push(`建议进一步提升房价定位，参考区域标准可提升至${(formData.targetPrice * 1.1).toFixed(0)}元/晚`);
    }
    if (formData.targetOccupancy < 85) {
        optimizations.push(`建议通过OTA平台推广、电竞赛事合作等方式提升目标入住率至85%以上`);
    }
    if (formData.equipmentRatio < 75) {
        optimizations.push(`建议提高电竞设备预算占比至75%以上，确保硬件竞争力`);
    }
    if (formData.renovationRooms < 20) {
        optimizations.push(`建议增加改造房间数至20间以上，以实现规模效应和品牌影响力`);
    }
    optimizations.push('建议选择标准版或旗舰版方案，配置RTX5060Ti及以上显卡，确保3-5年内不落后');
    optimizations.push('建议与滴灌通深度合作，享受品牌、运营、采购等全方位赋能');
    
    adviceOptimization.innerHTML = optimizations.map(o => `<li>${o}</li>`).join('');
}

// 生成对标案例
function generateBenchmarkCases(formData) {
    const benchmarkGrid = document.getElementById('benchmarkCases');
    if (!benchmarkGrid) return;
    
    // 筛选相似案例（同区域或相似规模）
    const similarCases = benchmarkCases.filter(c => 
        c.location === formData.location || 
        Math.abs(c.rooms - formData.renovationRooms) <= 15
    ).slice(0, 3);
    
    // 如果没有相似案例，随机选择3个
    const casesToShow = similarCases.length >= 2 ? similarCases : benchmarkCases.slice(0, 3);
    
    benchmarkGrid.innerHTML = casesToShow.map(c => `
        <div class="benchmark-case">
            <div class="case-header">
                <div class="case-name">${c.name}</div>
                <div class="case-tag">${locationRatings[c.location].name}</div>
            </div>
            <div class="case-metrics">
                <div class="case-metric">
                    <span class="label">改造房间：</span>
                    <span class="value">${c.rooms}间</span>
                </div>
                <div class="case-metric">
                    <span class="label">房价提升：</span>
                    <span class="value highlight">¥${c.beforePrice} → ¥${c.afterPrice}</span>
                </div>
                <div class="case-metric">
                    <span class="label">入住率提升：</span>
                    <span class="value highlight">${c.beforeOccupancy}% → ${c.afterOccupancy}%</span>
                </div>
                <div class="case-metric">
                    <span class="label">总投资：</span>
                    <span class="value">${c.investment}万元</span>
                </div>
                <div class="case-metric">
                    <span class="label">回本周期：</span>
                    <span class="value highlight">${c.payback}个月</span>
                </div>
                <div class="case-metric">
                    <span class="label">ROI：</span>
                    <span class="value highlight">${c.roi}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 重置表单
function resetEvaluationForm() {
    // 重置所有输入字段
    document.getElementById('projectName').value = '';
    document.getElementById('projectLocation').value = '';
    document.getElementById('hotelType').value = '';
    document.getElementById('totalRooms').value = '';
    document.getElementById('renovationRooms').value = '';
    document.getElementById('beforePrice').value = '';
    document.getElementById('beforeOccupancy').value = '';
    document.getElementById('beforeRevenue').value = '';
    document.getElementById('renovationBudget').value = '';
    document.getElementById('equipmentRatio').value = '';
    document.getElementById('targetPrice').value = '';
    document.getElementById('targetOccupancy').value = '';
    document.getElementById('gpuLevel').value = '';
    
    // 隐藏评估结果
    const resultsDiv = document.getElementById('evaluationResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    // 滚动到表单顶部
    document.getElementById('project-evaluation').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 历史记录功能
// ==========================================

// 保存评估到历史记录
function saveToHistory(projectData, evaluation) {
    try {
        // 获取现有历史记录
        let history = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
        
        // 创建新记录
        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            projectData: projectData,
            evaluation: evaluation
        };
        
        // 添加到历史记录开头
        history.unshift(record);
        
        // 限制最多保存20条记录
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // 保存到 localStorage
        localStorage.setItem('evaluationHistory', JSON.stringify(history));
        
        // 刷新历史记录显示
        loadHistory();
        
        return true;
    } catch (error) {
        console.error('保存历史记录失败:', error);
        return false;
    }
}

// 加载并显示历史记录
function loadHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
        const historyList = document.getElementById('historyList');
        
        if (!historyList) return;
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>暂无评估记录</p>
                    <p class="empty-hint">完成项目评估后，记录将自动保存在这里</p>
                </div>
            `;
            return;
        }
        
        // 渲染历史记录
        historyList.innerHTML = history.map(record => {
            const date = new Date(record.timestamp);
            const formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const { projectData, evaluation } = record;
            const scoreClass = getScoreClass(evaluation.overall);
            
            return `
                <div class="history-item" data-id="${record.id}">
                    <div class="history-item-header">
                        <div class="history-item-info">
                            <h4 class="history-item-name">${projectData.name}</h4>
                            <div class="history-item-meta">
                                <span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 0.875rem; height: 0.875rem;">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    ${projectData.location}
                                </span>
                                <span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 0.875rem; height: 0.875rem;">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    ${formattedDate}
                                </span>
                            </div>
                        </div>
                        <div class="history-item-score">
                            <div class="history-score-circle ${scoreClass}">
                                ${evaluation.overall}
                            </div>
                        </div>
                    </div>
                    <div class="history-item-stats">
                        <div class="history-stat">
                            <div class="history-stat-label">改造房间</div>
                            <div class="history-stat-value">${projectData.renovationRooms}间</div>
                        </div>
                        <div class="history-stat">
                            <div class="history-stat-label">总预算</div>
                            <div class="history-stat-value">${projectData.budget}万元</div>
                        </div>
                        <div class="history-stat">
                            <div class="history-stat-label">回本周期</div>
                            <div class="history-stat-value">${evaluation.details.paybackPeriod}月</div>
                        </div>
                        <div class="history-stat">
                            <div class="history-stat-label">年化ROI</div>
                            <div class="history-stat-value">${evaluation.details.projectedROI}%</div>
                        </div>
                    </div>
                    <div class="history-item-actions">
                        <button class="history-action-btn btn-load" onclick="loadHistoryRecord(${record.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                            加载数据
                        </button>
                        <button class="history-action-btn btn-delete" onclick="deleteHistoryRecord(${record.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            删除
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('加载历史记录失败:', error);
    }
}

// 根据分数返回样式类
function getScoreClass(score) {
    if (score >= 85) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 55) return 'score-medium';
    return 'score-poor';
}

// 加载历史记录数据到表单
function loadHistoryRecord(recordId) {
    try {
        const history = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
        const record = history.find(r => r.id === recordId);
        
        if (!record) {
            alert('记录不存在');
            return;
        }
        
        const data = record.projectData;
        
        // 填充表单数据（注意：formData使用的是简短的key名）
        document.getElementById('projectName').value = data.name || '';
        document.getElementById('projectLocation').value = data.location || '';
        document.getElementById('hotelType').value = data.hotelType || '';
        document.getElementById('totalRooms').value = data.totalRooms || '';
        document.getElementById('renovationRooms').value = data.renovationRooms || '';
        document.getElementById('beforePrice').value = data.beforePrice || '';
        document.getElementById('beforeOccupancy').value = data.beforeOccupancy || '';
        document.getElementById('beforeRevenue').value = data.beforeRevenue || '';
        document.getElementById('renovationBudget').value = data.budget || '';
        document.getElementById('equipmentRatio').value = data.equipmentRatio || '';
        document.getElementById('targetPrice').value = data.targetPrice || '';
        document.getElementById('targetOccupancy').value = data.targetOccupancy || '';
        document.getElementById('gpuLevel').value = data.gpuLevel || '';
        
        // 滚动到表单
        document.getElementById('project-evaluation').scrollIntoView({ behavior: 'smooth' });
        
        // 提示用户
        setTimeout(() => {
            alert('历史数据已加载到表单，您可以修改后重新评估');
        }, 500);
        
    } catch (error) {
        console.error('加载历史记录失败:', error);
        alert('加载失败，请重试');
    }
}

// 删除单条历史记录
function deleteHistoryRecord(recordId) {
    if (!confirm('确定要删除这条评估记录吗？')) {
        return;
    }
    
    try {
        let history = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
        history = history.filter(r => r.id !== recordId);
        localStorage.setItem('evaluationHistory', JSON.stringify(history));
        
        // 刷新显示
        loadHistory();
        
    } catch (error) {
        console.error('删除历史记录失败:', error);
        alert('删除失败，请重试');
    }
}

// 清空所有历史记录
function clearAllHistory() {
    if (!confirm('确定要清空所有评估记录吗？此操作不可恢复！')) {
        return;
    }
    
    try {
        localStorage.removeItem('evaluationHistory');
        loadHistory();
        alert('所有历史记录已清空');
    } catch (error) {
        console.error('清空历史记录失败:', error);
        alert('清空失败，请重试');
    }
}

// 页面加载完成后初始化历史记录
document.addEventListener('DOMContentLoaded', function() {
    // 加载历史记录
    loadHistory();
    
    // 绑定清空历史按钮
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearAllHistory);
    }
    
    // 初始化计算，显示默认值的结果
    calculate();
});
