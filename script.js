const imageInput = document.getElementById("images");
const preview = document.getElementById("preview");

let files = [];

imageInput.addEventListener("change", (e) => {

    files = [...e.target.files];

    preview.innerHTML = "";

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = function(event){

            const img = document.createElement("img");

            img.src = event.target.result;

            preview.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

});

async function convertPDF(){

    if(files.length===0){

        alert("Please select at least one image.");

        return;
    }

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    for(let i=0;i<files.length;i++){

        const data = await fileToData(files[i]);

        const img = new Image();

        img.src = data;

        await new Promise(resolve => img.onload = resolve);

        const pdfWidth = 210;

        const pdfHeight = (img.height * pdfWidth) / img.width;

        if(i>0){

            pdf.addPage();

        }

        pdf.addImage(
            data,
            "JPEG",
            0,
            0,
            pdfWidth,
            pdfHeight
        );

    }

    pdf.save("Images.pdf");

}

function fileToData(file){

    return new Promise(resolve=>{

        const reader = new FileReader();

        reader.onload = e => resolve(e.target.result);

        reader.readAsDataURL(file);

    });

}