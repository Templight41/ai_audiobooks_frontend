import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";


function App() {
  const [file, setFile] = useState(null);
  const [bookInfo, setBookInfo] = useState({
    pdfName: "",
    bookId: "",
    pageStart: "",
    pageEnd: "",
    userId: "armaanpasha3@gmail.com",
  });
  const [audio, setAudio] = useState(null);

  const [books, setBooks] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get("http://localhost:3000/books");
      setBooks(response.data);
    };

    fetchBooks();
  }, [])

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "pdf");

    // Replace with your server's URL
    const response = await axios.post("http://localhost:3000/upload/book", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await axios.get("http://localhost:3000/books").then((response) => {
      setBooks(response.data);
    });

    console.log("File uploaded to server:", response.data);
  };

  const bookSelect = async (event) => {
    setBookInfo(() => {
      return {
        ...bookInfo,
        pdfName: event.target.attributes.filename.value,
        bookId: event.target.attributes.bookId.value,
      };
    });

  }

  const genAudio = async () => {
    if (!bookInfo.pdfName || !bookInfo.pageStart) {
      alert("Please select a book and page range to generate audio!");
      return;
    }
    if(!bookInfo.pageEnd || bookInfo.pageEnd < bookInfo.pageStart) {
      setBookInfo(() => {
        return {
          ...bookInfo,
          pageEnd: bookInfo.pageStart,
        };
      });
    }

    const response = await axios.post("http://localhost:3000/generate/audio", bookInfo);

    setAudio(response.data.audioUrl);
  }

  return (
    <div>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
      <div>
        <h2>Books</h2>
        <div>
          {books.map((book) => (
            <button key={book.bookId} onClick={bookSelect} bookId={book.bookId} filename={book.fileName}>{book.title}</button>
          ))}
        </div>
        <br />
        <label htmlFor="start">Page Start</label>&nbsp;
        <input type="number" id="start" name="start" value={bookInfo.pageStart} onChange={(e) => setBookInfo({...bookInfo, pageStart: e.target.value})}/>
        &nbsp;&nbsp;&nbsp;
        <label htmlFor="end">Page End</label>&nbsp;
        <input type="number" id="end" name="end" value={bookInfo.pageEnd} onChange={(e) => setBookInfo({...bookInfo, pageEnd: e.target.value})}/>
      </div>

      <div>
        <h2>Book Info</h2>
        <p>PDF Name: {bookInfo.pdfName}</p>
        <p>Page Start: {bookInfo.pageStart}</p>
        <p>Page End: {bookInfo.pageEnd}</p>
      </div>

      <div>
        <button onClick={genAudio}>Generate Audio</button>
      </div>

      <br />

      <div>
        <audio src={audio} controls={true}></audio>
      </div>
    
    </div>
  );
};

export default App;
