const db = require("./dbConnection");

const tables = [
  {
    name: "books",
    query: `
        CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  quantity INT NOT NULL
);
 `,
  },
  {
    name: "users",
    query: `
    CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('librarian', 'user') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 `,
  },
  {
    name: "borrow-request",
    query: `
      CREATE TABLE IF NOT EXISTS borrow_requests(
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      book_id VARCHAR(36) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status ENUM('pending','approved','denied') DEFAULT 'pending',
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
      );
    `,
  },
  {
    name: "borrow-history",
    query: `
      CREATE TABLE IF NOT EXISTS borrow_history(
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        book_id VARCHAR(36) NOT NULL,
        borrowed_on DATE NOT NULL,
        returned_on DATE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (book_id) REFERENCES books(id)
      )
    `,
  },
  {
    name: "books_insert",
    query: `
      INSERT INTO books (id, title, author, quantity) VALUES
        ('1', 'To Kill a Mockingbird', 'Harper Lee', 5),
        ('2', '1984', 'George Orwell', 4),
        ('3', 'The Great Gatsby', 'F. Scott Fitzgerald', 6),
        ('4', 'Pride and Prejudice', 'Jane Austen', 3),
        ('5', 'The Catcher in the Rye', 'J.D. Salinger', 5),
        ('6', 'The Hobbit', 'J.R.R. Tolkien', 4),
        ('7', 'Fahrenheit 451', 'Ray Bradbury', 3),
        ('8', 'Jane Eyre', 'Charlotte Brontë', 2),
        ('9', 'Animal Farm', 'George Orwell', 6),
        ('10', 'Wuthering Heights', 'Emily Brontë', 4),
        ('11', 'The Alchemist', 'Paulo Coelho', 5),
        ('12', 'The Book Thief', 'Markus Zusak', 3),
        ('13', 'The Chronicles of Narnia', 'C.S. Lewis', 7),
        ('14', 'Moby Dick', 'Herman Melville', 2),
        ('15', 'The Little Prince', 'Antoine de Saint-Exupéry', 5),
        ('16', 'Lord of the Flies', 'William Golding', 3),
        ('17', 'The Kite Runner', 'Khaled Hosseini', 6),
        ('18', 'Brave New World', 'Aldous Huxley', 4),
        ('19', 'Crime and Punishment', 'Fyodor Dostoevsky', 2),
        ('20', 'The Shining', 'Stephen King', 3);
    `,
  },
];
const createTables = () => {
  tables.forEach((table) => {
    db.query(table.query, (err) => {
      if (err) {
        console.log(`Error Connecting to Table ${table.name}`, err.message);
      } else {
        console.log(`${table.name} is Created Successfully`);
      }
    });
  });
};
createTables();
