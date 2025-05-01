import React, { useEffect, useState } from 'react'
import BookCards from '../shared/BookCards';
const BASE_URL = import.meta.env.VITE_API_URL;

const OtherBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/all-books`).then(res => res.json()).then(data => setBooks(data.slice(5, 12)))
    }, [])

    return (
        <div className='mt-24'>
            <BookCards books={books} headline={"Other Books"} />
        </div>
    )
}

export default OtherBooks