import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'
const CretePost = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    const [base64Image, setBase64Image] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [suggestedOptions, setSuggestedOptions] = useState([]);
    // const {userid} = useParams()

    // useEffect(()=>{
    //    if(url){
    //     fetch("/createpost",{
    //         method:"post",
    //         headers:{
    //             "Content-Type":"application/json",
    //             "Authorization":"Bearer "+localStorage.getItem("jwt")
    //         },
    //         body:JSON.stringify({
    //             title,
    //             body,
    //             pic:url
    //         })
    //     }).then(res=>res.json())
    //     .then(data=>{
    
    //        if(data.error){
    //           M.toast({html: data.error,classes:"#c62828 red darken-3"})
    //        }
    //        else{
    //            M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
    //            history.push('/')
    //        }
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }
    // },[url])

    // useEffect(()=>{
    //     fetch(`/user/${userid}`,{
    //         headers:{
    //             "Authorization":"Bearer "+localStorage.getItem("jwt")
    //         }
    //     }).then(res=>res.json())
    //     .then(result=>{
    //         console.log(result)         
    //          setProfile(result)
    //     })
    //  },[])

    const submit = () => {
        console.log("submit called")
        if (url ) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url,
                    tagged: selectedOptions
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error +  ": Title and Body", classes: "#c62828 red darken-3" });
                } else {
                    M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" });
                    history.push('/');
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
  

    const isBase64 = (str) => {
        return /^data:image\/[a-z]+;base64,/.test(str);
    };   

    const upload = () => {
        const data = new FormData()
       data.append("file",image)
       data.append("upload_preset","insta-clone-test")
       data.append("cloud_name","namecloud")
       fetch("https://api.cloudinary.com/v1_1/namecloud/image/upload",{
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)
       })
       .catch(err=>{
           console.log(err)
       })
    };
    
    
    useEffect(() => {
        if (base64Image) {
            console.log("Image is base64");
            postDetails();
        }
    }, [base64Image]); 
    
    const ImageChange = async (e) => {
        setImage(e.target.files[0]);
        handleImageChange(e)
    };

    useEffect(() => {
        if (image) {
            console.log("Image is set");
            upload();
        }
    }, [image]);
   
    const handleImageChange = async (e) => {
        const file = e.target.files[0]; 
        // setImage(e.target.files[0]);   
        const reader = new FileReader();
    
        reader.onloadend = () => {
            console.log(reader.result); 
            setBase64Image(reader.result);
        };   
        reader.readAsDataURL(file);
    };
    
    const handleOptionChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            selectedValues.push(options[i].value);
            }
        }
        console.log("Selected values", selectedValues);
        setSelectedOptions(selectedValues);
    };


    const postDetails = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const newData = [];
    
        console.log("name:", user.name);
    
        const data = new FormData();
        data.append("user_id", user.name); // Append user's name to FormData
        data.append("pic", base64Image); // Append base64Image to FormData
    
        fetch("http://10.11.12.133:4488/get-suggestions", {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            console.log("data", typeof data, data[0]);
            for (let i = 0; i < data.length; i++) { 
                newData.push(data[i].name);
            }           
            console.log("new Data", newData);
            setSuggestedOptions(newData);
            // console.log("new Data", typeof newData, newData);
        })
        .catch(err => {
            console.error(err);
        });
    };
    
    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };
    
    const handleSelectAll = () => {
        setSelectedOptions(suggestedOptions);
    };
    
    const handleClearAll = () => {
        setSelectedOptions([]);
    };
    
    const checkboxOptions = suggestedOptions.map((option, index) => (
        <label key={index} style={{ flex: '1', marginRight: '10px', color: 'green' }}>
            <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
            />
            {option}
        </label>
    ));    

   return(
       <div className="card input-filed"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}
       >
           <input 
           type="text"
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
           <input
            type="text"
             placeholder="body"
             value={body}
            onChange={(e)=>setBody(e.target.value)}
             />
           <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={ImageChange} />
                {/* {base64Image && <img src={base64Image} alt="Converted to Base64" />} */}
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>

            {url && (
                <div>
                    <p>Uploaded Image:</p>
                    <img src={url} alt="Uploaded" style={{ maxWidth: "100%" }} />
                    <h6>Tag People: </h6>
                <div>
            
                <div>
            
            <div >
                {checkboxOptions}
            </div>
            <div style={{padding: '5px 10px'}}>
                Selected Options: {selectedOptions.join(", ")}
            </div>
            <div>
                <button style={{ marginRight: '10px', backgroundColor: '#66c8e5', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }} onClick={handleSelectAll}>Select All</button>
                <button style={{ backgroundColor: '#66c8e5', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }} onClick={handleClearAll}>Clear All</button>
            </div>
        </div>
           </div>
                </div>
            )}

           <br></br>

           <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={submit}>
                Submit Post
            </button>
       </div>
   )
}


export default CretePost