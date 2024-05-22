
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Navigate} from "react-router-dom";
import Editor from '../Editor';
const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];


  export default function CreatePost() {
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect,setRedirect]= useState('');

    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
         data.set('file', files[0]);
        ev.preventDefault();
        console.log(files);
        const response = await fetch('http://localhost:4000/post', {
          method: 'POST',
          body: data,
          credentials:'include',
        
        });

        if(response.ok){
          setRedirect(true);
        }
        
    }
    if(redirect){
      return <Navigate to={'/'}/>
    }
     
    return(
        <form onSubmit={createNewPost}>
            <input type="title" 
            placeholder={'Title'} 
            value={title}

            onChange={ev=> setTitle(ev.target.value)}/>
            <input type="summary" placeholder={'Summary'} value={summary}
            onChange={ev=>setSummary(ev.target.value)}/>
            <input type="file" //here we didnt take the value as the file as the file system gives whole json idex of an object of a file there for we when set data.set for  a file  we consider it an array and the selected file would  be the first file
            onChange={ev=>setFiles(ev.target.files)}/>
           <Editor onChange={setContent} value={content}/>

           <button style={{margin:'5px'}}>Create Post</button>
        </form>// react quills is been used for the create post
    
    )
}