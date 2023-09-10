'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';
import { useSession } from 'next-auth/react';

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className='mt-10 prompt_layout'>
            {data &&
                data.map((post) => (
                    <PromptCard
                        key={post._id}
                        post={post}
                        handleTagClick={handleTagClick}
                    />
                ))}
        </div>
    );
};

const Feed = () => {
    const [searchText, setSearchText] = useState('');
    const [posts, setPosts] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch('/api/prompt');
            const data = await res.json();

            setPosts(data);
        };

        if (session?.user.id) {
            fetchPost();
        }
    }, [session]);

    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearchText(e.target.value);
        console.log(e.target.value);
    };
    return (
        <section className='feed'>
            <form
                onChange={handleSearchChange}
                className='relative w-full flex-center'
            >
                <input
                    type='text'
                    placeholder='Search for a tag or a username'
                    value={searchText}
                    required
                    className='search_input peer'
                />
            </form>

            <PromptCardList data={posts} handleTagClick={() => {}} />
        </section>
    );
};

export default Feed;
