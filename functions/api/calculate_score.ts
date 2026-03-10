// ============================================================
// Cloudflare Pages Function: /api/calculate_score
// TypeScript port of backend/app.py  (InvestmentEvaluator)
// ============================================================

// ---------- types ----------
interface Hotel {
  name?: string;
  distance?: number | string;
  rooms?: number | string;
  price_range?: string;
  grade?: string;
}

interface VenueDist {
  '1km以内'?: number;
  '1-2km'?: number;
  '2-3km'?: number;
  备注?: string;
}

interface CustomerFlow {
  企业年轻员工?: string;
  高校学生?: string;
  商旅与参会客群?: string;
}

interface CompetitivePattern {
  直接竞品?: string;
  潜在竞品?: string;
  替代娱乐?: string;
}

interface RequestBody {
  geographic_location?: string;
  core_customer_flow?: CustomerFlow;
  competitive_pattern?: CompetitivePattern;
  esports_venue_distribution?: VenueDist;
  esports_hotel_distribution?: Hotel[];
  business_hotel_distribution?: Hotel[];
  pcf_daily?: number | string;
  irr_frequency?: string;
}

// ---------- helpers ----------
function clamp(v: number, lo = 0, hi = 10) {
  return Math.max(lo, Math.min(hi, v));
}

// ---------- scoring ----------
const GEO_HIGH = ['阿里巴巴','杭师大','未来科技城','核心区','商圈','CBD','高新区'];
const GEO_MED  = ['产业园','大学城','地铁站','商业区','交通枢纽'];
const GEO_LOW  = ['郊区','偏远'];

function calcGeoScore(text: string): number {
  let s = 5.0;
  for (const kw of GEO_HIGH) if (text.includes(kw)) s += 1.5;
  for (const kw of GEO_MED)  if (text.includes(kw)) s += 1.0;
  for (const kw of GEO_LOW)  if (text.includes(kw)) s -= 2.0;
  return clamp(s);
}

function calcCustomerScore(cf: CustomerFlow): number {
  const weights: [keyof CustomerFlow, number][] = [
    ['企业年轻员工', 0.40],
    ['高校学生',     0.35],
    ['商旅与参会客群', 0.25],
  ];
  const positive = ['密集','活跃','需求旺盛','消费能力强','目标客群'];
  let total = 0;
  for (const [key, w] of weights) {
    const desc = cf[key] ?? '';
    let sub = desc.length < 20 ? 0 : desc.length < 50 ? 6 : desc.length < 100 ? 8 : 9;
    for (const kw of positive) if (desc.includes(kw)) sub += 0.5;
    total += sub * w;
  }
  return clamp(total);
}

function calcVenueScore(venue: VenueDist): number {
  const total = (venue['1km以内'] ?? 0) + (venue['1-2km'] ?? 0) + (venue['2-3km'] ?? 0);
  if (total <= 15) return 9.5;
  if (total <= 20) return 7.5;
  if (total <= 25) return 6.0;
  if (total <= 30) return 4.0;
  return 2.0;
}

function calcEsportsHotelScore(hotels: Hotel[]): number {
  if (!hotels.length) return 10.0;
  let compScore = 0;
  for (const h of hotels) {
    const dist  = parseFloat(String(h.distance ?? 0));
    const rooms = parseInt(String(h.rooms ?? 0), 10);
    compScore += dist <= 1 ? rooms * 0.8 : dist <= 2 ? rooms * 0.5 : rooms * 0.3;
  }
  if (compScore <= 30)  return 10.0;
  if (compScore <= 60)  return 8.0;
  if (compScore <= 100) return 6.0;
  return 4.0;
}

function calcBusinessHotelScore(hotels: Hotel[]): number {
  if (!hotels.length) return 6.0;
  const totalRooms = hotels.reduce((s, h) => s + parseInt(String(h.rooms ?? 0), 10), 0);
  if (totalRooms <= 100) return 7.0;
  if (totalRooms <= 300) return 9.0;
  if (totalRooms <= 500) return 8.0;
  return 6.0;
}

function calcPcfScore(pcf: number): number {
  if (pcf >= 3000) return 10.0;
  if (pcf >= 2000) return 8.5;
  if (pcf >= 1000) return 7.0;
  if (pcf >= 500)  return 5.0;
  if (pcf >= 200)  return 3.0;
  return 1.5;
}

function calcFrequencyScore(freq: string): number {
  const m: Record<string, number> = { daily: 10, weekly: 7, biweekly: 5 };
  return m[freq] ?? 3.0;
}

function calcDiffScore(pattern: CompetitivePattern): number {
  const text = [pattern.直接竞品, pattern.潜在竞品, pattern.替代娱乐].join(' ');
  let s = 5.0;
  for (const kw of ['空白','差异化','独家','唯一','首家','无竞品','无直接']) if (text.includes(kw)) s += 1.0;
  for (const kw of ['激烈','饱和','多家','竞争强','红海'])                if (text.includes(kw)) s -= 0.8;
  return clamp(s);
}

function generateConclusion(
  geo: number, customer: number, pcf: number,
  venue: number, hotel: number, business: number,
  diff: number, frequency: number
) {
  const ret  = geo * 0.4 + customer * 0.6;
  const yld  = pcf * 0.5 + frequency * 0.5;
  const risk = venue * 0.4 + hotel * 0.6;
  const ctrl = business * 0.4 + diff * 0.6;

  const strengths:   string[] = [];
  const risks:       string[] = [];
  const suggestions: string[] = [];

  if (ret  >= 8) strengths.push(`回报潜力强（${ret.toFixed(1)}分），地段与客群匹配度高`);
  if (yld  >= 7) strengths.push(`收益质量优（${yld.toFixed(1)}分），PCF现金流充裕且分账顺畅`);
  if (risk >= 8) strengths.push(`竞争风险低（${risk.toFixed(1)}分），市场空白明显，先发优势突出`);
  if (ctrl >= 7) strengths.push(`管控能力强（${ctrl.toFixed(1)}分），差异化护城河清晰`);

  if (ret  < 6) risks.push(`回报维度偏弱（${ret.toFixed(1)}分），地理位置或客群覆盖不足`);
  if (yld  < 5) risks.push(`收益维度偏低（${yld.toFixed(1)}分），PCF现金流或分账频率需优化`);
  if (risk < 6) risks.push(`市场竞争较激烈（${risk.toFixed(1)}分），电竞馆或同类酒店密集`);
  if (ctrl < 5) risks.push(`管控能力薄弱（${ctrl.toFixed(1)}分），差异化优势不明显`);

  if (geo       < 7) suggestions.push('建议选择靠近高校、产业园或核心商圈的位置以提升地段回报');
  if (pcf       < 5) suggestions.push('建议提升房间数量或ADR，扩大PCF日现金流规模');
  if (frequency < 7) suggestions.push('建议与投资方协商更高频的分账周期（如日分账），加速资金回收');
  if (hotel     < 6) suggestions.push('电竞酒店竞争较激烈，建议打造差异化主题房型或服务体验');
  if (diff      < 6) suggestions.push('建议强化产品差异化，构建电竞IP、场景或会员体系壁垒');
  if (!suggestions.length) suggestions.push('项目整体条件优良，建议按计划推进并持续跟踪市场动态');

  return {
    strengths:   strengths.length   ? strengths   : ['项目具备一定发展潜力'],
    risks:       risks.length       ? risks       : ['整体风险可控'],
    suggestions,
  };
}

function evaluate(data: RequestBody) {
  const geo      = calcGeoScore(data.geographic_location ?? '');
  const customer = calcCustomerScore(data.core_customer_flow ?? {});
  const pcf      = calcPcfScore(parseFloat(String(data.pcf_daily ?? 0)));
  const freq     = calcFrequencyScore(data.irr_frequency ?? '');
  const venue    = calcVenueScore(data.esports_venue_distribution ?? {});
  const hotel    = calcEsportsHotelScore(data.esports_hotel_distribution ?? []);
  const biz      = calcBusinessHotelScore(data.business_hotel_distribution ?? []);
  const diff     = calcDiffScore(data.competitive_pattern ?? {});

  const returnScore  = geo * 0.4 + customer * 0.6;
  const yieldScore   = pcf * 0.5 + freq * 0.5;
  const riskScore    = venue * 0.4 + hotel * 0.6;
  const controlScore = biz  * 0.4 + diff  * 0.6;

  const comp = returnScore * 0.30 + yieldScore * 0.25 + riskScore * 0.25 + controlScore * 0.20;

  let value_level: string, recommendation: string, color: string;
  if      (comp >= 8.5) { value_level = '高投资价值';   recommendation = '强烈推荐投资';           color = '#10b981'; }
  else if (comp >= 7.0) { value_level = '较高投资价值'; recommendation = '推荐投资';               color = '#3b82f6'; }
  else if (comp >= 5.5) { value_level = '中等投资价值'; recommendation = '谨慎投资，建议优化方案'; color = '#f59e0b'; }
  else                  { value_level = '投资价值偏低'; recommendation = '不建议投资，风险较高';   color = '#ef4444'; }

  return {
    quadrant_scores: {
      return_score:  Math.round(returnScore  * 100) / 100,
      yield_score:   Math.round(yieldScore   * 100) / 100,
      risk_score:    Math.round(riskScore    * 100) / 100,
      control_score: Math.round(controlScore * 100) / 100,
    },
    comprehensive_score: Math.round(comp * 100) / 100,
    value_level,
    recommendation,
    color,
    dimension_scores: {
      geographic_location: Math.round(geo      * 10) / 10,
      core_customer_flow:  Math.round(customer * 10) / 10,
      pcf_yield:           Math.round(pcf      * 10) / 10,
      frequency:           Math.round(freq     * 10) / 10,
      esports_venue:       Math.round(venue    * 10) / 10,
      esports_hotel:       Math.round(hotel    * 10) / 10,
      business_hotel:      Math.round(biz      * 10) / 10,
      differentiation:     Math.round(diff     * 10) / 10,
    },
    conclusion: generateConclusion(geo, customer, pcf, venue, hotel, biz, diff, freq),
  };
}

// ---------- validation ----------
function validate(data: RequestBody): string[] {
  const errors: string[] = [];

  const geo = data.geographic_location ?? '';
  if (!geo || geo.trim().length < 10)
    errors.push('地理位置内容过短，请至少填写10个字符');

  const cf = data.core_customer_flow ?? {};
  const hasCF = ['企业年轻员工','高校学生','商旅与参会客群'].some(k => (cf as any)[k]?.trim());
  if (!hasCF) errors.push('核心客流至少填写一项');

  const venue = data.esports_venue_distribution ?? {};
  for (const key of ['1km以内','1-2km','2-3km'] as const) {
    const v = (venue as any)[key];
    if (v !== undefined && v !== null && v !== '' && isNaN(parseFloat(String(v))))
      errors.push(`电竞馆分布-${key} 必须是有效数字`);
  }

  for (const [listKey, label] of [
    ['esports_hotel_distribution',  '电竞酒店分布'],
    ['business_hotel_distribution', '同档次商务酒店分布'],
  ] as [keyof RequestBody, string][]) {
    const list = (data[listKey] ?? []) as Hotel[];
    if (!Array.isArray(list)) { errors.push(`${label}格式错误`); continue; }
    list.forEach((h, i) => {
      if (!h.name) errors.push(`${label}第${i+1}项缺少酒店名称`);
    });
  }

  return errors;
}

// ---------- handler ----------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequest: PagesFunction = async ({ request }) => {
  // preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ code: 405, msg: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  let body: RequestBody;
  try {
    body = await request.json() as RequestBody;
  } catch {
    return new Response(JSON.stringify({ code: 400, msg: '请求数据解析失败', data: null }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const errors = validate(body);
  if (errors.length) {
    return new Response(JSON.stringify({ code: 400, msg: '数据验证失败', errors, data: null }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const result = evaluate(body);
  return new Response(JSON.stringify({ code: 200, msg: '评估成功', data: result }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
  });
};
