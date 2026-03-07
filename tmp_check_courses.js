const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://survey_n5dd_user:k9NS8tflghBknSqN9b9nd8VpNWL7uBvi@dpg-d6l517h5pdvs73f2a0k0-a.oregon-postgres.render.com/survey_n5dd?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function checkCourses() {
    try {
        console.log("Checking courses in database...");
        const res = await pool.query('SELECT id, title FROM courses ORDER BY id ASC LIMIT 50');
        console.log("AVAILABLE COURSES IN DB:");
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error("ERROR CHECKING COURSES:", err.message);
        process.exit(1);
    }
}

checkCourses();
