const generatedForm  = document.querySelector(".generated-form");
const imageGallery  = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "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";
let isImageGeanerating = false;
const updateImageCard = (imgDataArray)=>{
    imgDataArray.forEach((imgObject, index)=>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelectorAll("img");
        const downloadBtn = imgCard.querySelectorAll(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src= aiGeneratedImg;
        imgElement.onload =()=>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime().jpg}`)

        }
    })
}


const generateAiImages = async(userPrompt, userImageQuantity)=>{
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n:parseInt(userImageQuantity),
                size: "512x512",
                response_formate: "b64_json"
            })
        });
        if(!response.ok) throw new Error("Faild to generate images! please try again.");
        const {data}= await response.json();
        updateImageCard([...data]);

    } catch(error){
        alert(error.message)
    } finally{
        isImageGeanerating = false;
    }
};
const handleFormSubmission = (e)=>{
    e.preventDefault();
    if(isImageGeanerating) return ;
    isImageGeanerating =true;
 
    const userPrompt = e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;

    //Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length:userImageQuantity},()=>
        `<div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImageQuantity);
}

generatedForm.addEventListener("submit",handleFormSubmission)