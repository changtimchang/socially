import pool from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10); // 기본값 1
  const limit = 10; // 한 페이지당 10개 데이터
  const offset = (page - 1) * limit; // 페이지에 맞는 OFFSET 계산

  const client = await pool.connect(); // pool.connect()를 통해 Client를 가져옴
  try {
    // 페이지네이션을 위한 쿼리
    const result = await client.query(
      'SELECT * FROM bom LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // 전체 데이터 개수 가져오기
    const countResult = await client.query('SELECT COUNT(*) FROM bom');
    const totalCount = parseInt(countResult.rows[0].count, 10); // 전체 데이터 개수

    return new Response(
      JSON.stringify({
        data: result.rows,
        totalCount: totalCount, // 전체 데이터 개수를 클라이언트에 전달
        totalPages: Math.ceil(totalCount / limit), // 전체 페이지 수 계산
        currentPage: page, // 현재 페이지 번호
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
    });
  } finally {
    client.release(); // 사용 후 클라이언트를 반환
  }
}
