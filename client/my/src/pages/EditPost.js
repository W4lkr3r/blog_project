
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Navigate, useParams} from "react-router-dom";

export default function EditPost(){
    const{id}=useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState(false);
    
    const [redirect,setRedirect]= useState('');


    useEffect(()=>{
      fetch('http://localhost:4000/post/' +id)
      .then(response=>{
        response.json().then(postInfo=>{
            setTitle(postInfo.title);
            setContent(postInfo.content);
            setSummary(postInfo.summary);
        });
      });
    },[]);

    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id',id);
        if(files?.[0]){
            data.set('file', files?.[0]);
        }
         
      
     const response= await fetch('http://localhost:4000/post',{
            method:'PUT',
            body: data,
            credentials: 'include',

        });
        if(response.ok){
      setRedirect(true);
        }
    }
    if(redirect){
        return <Navigate to={'/post/'+id}/>
      }
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
      ]
      
    
       
      return(
          <form onSubmit={updatePost}>
              <input type="title" 
              placeholder={'Title'} 
              value={title}
  
              onChange={ev=> setTitle(ev.target.value)}/>
              <input type="summary" placeholder={'Summary'} value={summary}
              onChange={ev=>setSummary(ev.target.value)}/>
              <input type="file" //here we didnt take the value as the file as the file system gives whole json idex of an object of a file there for we when set data.set for  a file  we consider it an array and the selected file would  be the first file
              onChange={ev=>setFiles(ev.target.files)}/>
             <ReactQuill value={content} 
             onChange={newValue=>setContent(newValue)} 
             modules={modules} 
             formats={formats}/>
  
             <button style={{margin:'5px'}}>Update Post</button>
          </form>// react quills is been used for the create post
      
      )
  }
