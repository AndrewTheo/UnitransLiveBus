import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

 class FetchDemo extends React.Component {
   state = {
     posts: []
   }

   componentDidMount() {
     axios.get(`https://www.reddit.com/r/buildapcsales.json`)
       .then(res => {
         const posts = res.data.data.children.map(obj => obj.data);
         console.log(posts);
         name = "andrew";
         this.setState({ posts, name });
       });
   }

   render() {
     return (
       <div>
         <h1>   </h1>
         <h1>   </h1>
         <ul>
           {this.state.posts.map(post =>
             <li key={post.id}>{post.title}</li>
            
           )}
         </ul>
       </div>
     );
   }
 }

const rootElement = document.getElementById("root");
//ReactDOM.render(<FetchDemo subreddit="buildapcsales" />, rootElement);
ReactDOM.render(<FetchDemo />, rootElement);
