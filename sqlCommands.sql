CREATE TABLE learners (

learner_id SERIAL PRIMARY KEY,

first_name VARCHAR(50),

last_name VARCHAR(50),

username VARCHAR(50) UNIQUE,

school VARCHAR(100),

email VARCHAR(100) UNIQUE,

password_hash TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS courses (

course_id SERIAL PRIMARY KEY,

title VARCHAR(100) NOT NULL,

description TEXT

);

CREATE TABLE IF NOT EXISTS lessons (

lesson_id SERIAL PRIMARY KEY,

course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,

title VARCHAR(100) NOT NULL,

level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,

content JSONB NOT NULL,   -- Structured JSON with objectives, explanation, examples, exercises, etc.

order_number INT,

UNIQUE(course_id, level, order_number)  -- ensures each lesson in a level is uniquely ordered

);

CREATE TABLE IF NOT EXISTS enrollments (

enrollment_id SERIAL PRIMARY KEY,

learner_id INT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,

course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,

current_level VARCHAR(20) CHECK (current_level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,

current_lesson INT,  -- Could store lesson_id or the order_number within the current level

quiz_marks JSONB DEFAULT NULL,    -- For storing marks per lesson (e.g., {"lesson1":80, "lesson2":90})

quiz_answers JSONB DEFAULT NULL,  -- For storing submitted answers (structure as needed)

ai_feedback TEXT DEFAULT NULL,    -- AI feedback for quizzes/lessons

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Insert JavaScript course

INSERT INTO courses (title, description)

VALUES ('JavaScript', 'Learn JavaScript to build dynamic, interactive web applications.')

RETURNING *;

-- Insert Python course

INSERT INTO courses (title, description)

VALUES ('Python', 'Learn Python for machine learning , data analysis, automation,web development and more.')

RETURNING *;

-- Insert HTML/CSS course

INSERT INTO courses (title, description)

VALUES ('HTML/CSS', 'Learn HTML and CSS to build and style static web pages.')

RETURNING *;

INSERT INTO lessons (course_id, title, level, content, order_number)

VALUES (

1,

'Lesson 1: Introduction to JavaScript',

'Beginner',

$${

"title": "Lesson 1: Introduction to JavaScript",

"contentBlocks": [

  {

    "type": "section",

    "title": "Lesson Objectives (What you will learn)",

    "content": "<ul><li><em>Understand what JavaScript is</em></li><li><em>Learn why we use it</em></li><li><em>See how it’s used in real websites</em></li></ul>"

  },

  {

    "type": "section",

    "title": "1. What is JavaScript?",

    "content": "<p><strong>JavaScript</strong> is a language used to make web pages interactive (fun and active). It helps websites do things when you click or type.</p><p>It works together with:</p><ul><li><strong>HTML</strong> – gives structure to the web page (like headings, paragraphs)</li><li><strong>CSS</strong> – makes the web page look nice (colors, fonts)</li><li><strong>JavaScript</strong> – adds actions (like pop-ups, buttons that do something)</li></ul>"

  },

  {

    "type": "section",

    "title": "2. Real Examples of JavaScript",

    "content": "<ul><li>Games like the Chrome Dino game</li><li>Login forms or password strength checkers</li><li>Maps that move and zoom, like Google Maps</li><li>Websites like YouTube and Google – interactive buttons, videos, and search</li></ul>"

  },

  {

    "type": "section",

    "title": "3. Try This Example",

    "content": "<p>Click the button and see what happens! Try changing the message inside the quotes.</p><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;body&gt;\n  &lt;h2&gt;JavaScript in Action&lt;/h2&gt;\n  &lt;button onclick=&quot;alert('Hello, JavaScript!')&quot;&gt;Click Me&lt;/button&gt;\n&lt;/body&gt;\n&lt;/html&gt;</code></pre>",

    "runnable": true

  },

  {

    "type": "exercise",

    "title": "4. Exercise: Change the Message",

    "description": "Change this part of the code to say something new:",

    "content": "<pre><code>alert('Your message here!');</code></pre>",

    "runnable": true

  },

  {

    "type": "exercise",

    "title": "5. Exercise: Say Your Name",

    "description": "Write a script that shows your name in an alert box:",

    "content": "<pre><code>&lt;script&gt;\n  alert('Hello, my name is [Your Name]!');\n&lt;/script&gt;</code></pre>",

    "runnable": true

  },

  {

    "type": "exercise",

    "title": "6. Exercise: Ask for a Name",

    "description": "This script asks the user for their name and then displays a greeting:",

    "content": "<pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n  &lt;title&gt;JavaScript Prompt&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;button onclick=&quot;askName()&quot;&gt;Enter Your Name&lt;/button&gt;\n  &lt;script&gt;\n    function askName() {\n      let name = prompt('What is your name?');\n      alert('Hello, ' + name + '! Welcome to JavaScript.');\n    }\n  &lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;</code></pre>",

    "runnable": true

  },

  {

    "type": "section",

    "title": "7. Summary",

    "content": "<ul><li><strong>JavaScript makes websites interactive.</strong></li><li>You can use it to build games, validate forms, or make buttons perform actions.</li><li>You learned how to show messages and prompt the user for input using alerts and prompts.</li></ul>"

  },

  {

    "type": "quiz",

    "title": "Quiz: Lesson 1",

    "content": "<ol><li>What is JavaScript used for?<br><em>Answer:</em> Making web pages interactive.</li><li>Which tag is used to add JavaScript to an HTML file?<br><em>Answer:</em> &lt;script&gt;</li></ol>"

  }

]

}$$::jsonb,

1

);

CREATE OR REPLACE FUNCTION create_learner(
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_username VARCHAR,
    p_school VARCHAR,
    p_email VARCHAR,
    p_password_hash TEXT
)
RETURNS TABLE (
    out_learner_id INT,
    out_first_name VARCHAR,
    out_last_name VARCHAR,
    out_username VARCHAR,
    out_school VARCHAR,
    out_email VARCHAR
)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_learner_id INT;
    v_first_name VARCHAR;
    v_last_name VARCHAR;
    v_username VARCHAR;
    v_school VARCHAR;
    v_email VARCHAR;
BEGIN
    -- Check if username already exists
    IF EXISTS (SELECT 1 FROM learners lr WHERE lr.username = p_username) THEN
        RAISE EXCEPTION USING
            MESSAGE = 'Duplicate username found',
            DETAIL = 'Username is already taken',
            ERRCODE = 'P0101';
    END IF;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM learners lr WHERE lr.email = p_email) THEN
        RAISE EXCEPTION USING
            MESSAGE = 'Duplicate email found',
            DETAIL = 'Email is already taken',
            ERRCODE = 'P0102';
    END IF;

    -- Insert the new learner, capturing results in local variables
    INSERT INTO learners (
        first_name, 
        last_name, 
        username, 
        school, 
        email, 
        password_hash
    )
    VALUES (
        p_first_name, 
        p_last_name, 
        p_username, 
        p_school, 
        p_email, 
        p_password_hash
    )
    RETURNING 
        learner_id,
        first_name,
        last_name,
        username,
        school,
        email
    INTO
        v_learner_id,
        v_first_name,
        v_last_name,
        v_username,
        v_school,
        v_email;

    -- Return them with different output column names to avoid any ambiguity
    RETURN QUERY
    SELECT
        v_learner_id  AS out_learner_id,
        v_first_name  AS out_first_name,
        v_last_name   AS out_last_name,
        v_username    AS out_username,
        v_school      AS out_school,
        v_email       AS out_email;
END;
$$;