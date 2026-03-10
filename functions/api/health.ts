export const onRequest = () => {
  return new Response(
    JSON.stringify({ status: 'ok', message: '项目投资评估系统运行正常' }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
};
