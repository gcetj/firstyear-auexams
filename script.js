//const deptElement = document.getElementById("dept");
const subCodesElement = document.getElementById("subCode");
const yearElement = document.getElementById("year");
const errElement = document.getElementById("errMessage");
const uploadMessageElement = document.getElementById("uploadMessage");
const regulationElement = document.getElementById("regulation");
const form = document.getElementById('form');

var d = new Date();

const subCodes = {
    "2013": ["CY8151","GE8151","GE8252","HS8151","MA8151","PH8151","BE8251","BE8252","BE8253","BE8254","BE8255","CS8251","EC8251","EC8252","EE8251","GE8291","GE8292","HS8251","MA8251","PH8201","PH8251","PH8252","PH8253"],
    "2017": ["CY8151","GE8151","GE8252","HS8151","MA8151","PH8151","BE8251","BE8252","BE8253","BE8254","BE8255","CS8251","EC8251","EC8252","EE8251","GE8291","GE8292","HS8251","MA8251","PH8201","PH8251","PH8252","PH8253"]
};

function changeRegulation() {
    subCodesElement.innerHTML = '';

    let optionsInsert = '';
    //console.log(optionsInsert);
    let option = document.createElement('option');
    option.text = '--Select one--';
    option.value = "none";
    subCodesElement.append(option);
    //optionsInsert.concat(option);
    //console.log(optionsInsert);

    let subjectCodes = subCodes[regulationElement.value].sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
        optionsInsert.concat(option);
    }
    // console.log(optionsInsert);
    // subCodesElement.innerHTML = optionsInsert;
}

function deptChange(e) {
    subCodesElement.innerHTML = '';
    //let department = deptElement.value;
    
    let option = document.createElement('option');
    option.text = "--Select one--";
    option.value = "none";
    subCodesElement.append(option);

    let subjectCodes = subCodes.sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        let option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
    }
}

const checkInputs = () => {
    if (subCodesElement.value == "none" || yearElement.value == "none") {
        alert("Invalid year or subject code");
        return false;
    }
    return true;
}

const checkTime = () => {
    console.log("Checking the time");
    if (!(d.getHours() >= 13 && d.getHours() <= 14 || d.getHours() >= 18 && d.getHours() <= 22)) {
        errElement.style.display = "block";
        enabled = false;
        return false;
    }
    return true;
}

const checkFileNaming = (filename) => {
    let pdfCheck = filename.split(".");
    if(pdfCheck[1] != "pdf" && pdfCheck[1] != "PDF") {
        alert("Only pdf files are accepted");
        return false;
    }

    let filenaming = filename.split("-");
    console.log(filenaming);
    if (filenaming.length != 2 || filenaming[0].length != 12 || filenaming[1].length != 10) {
        alert("File name is not proper");
        alert("File name should in the format [Reg.No]-[Sub.Code] (all uppercase)");
        return false;
    }

    return true;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    console.log(checkInputs());

    if (!checkInputs()) {
        return;
    }   

    if (!confirm("Sure to submit?")) {
        return;
    }

    if (form.filename.value.length != 12) {
        alert("Check your register number");
        return;
    }

    // if (!checkTime()) {
    //     alert("Answer Submission Time exceeded! Contact your Supervisor");
    //     return;
    // }
    const file = form.file.files[0];
    const fr = new FileReader();
    var d = new Date();

    try {
        fr.readAsArrayBuffer(file);
    } catch(err) {
        alert("Please make sure you selected the correct file or contact your supervisor");
        uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
        uploadMessageElement.style.display = 'block';
    }

    fr.onload = f => {

        if (!checkFileNaming(file.name)) {
            return;
        }
        
        uploadMessageElement.innerHTML = "Uploading... Please Wait!"
        uploadMessageElement.style.display = 'block';

        let fileName = file.name;

        let url = "https://script.google.com/macros/s/AKfycbynruPTcIxHczyJ6Z4sGf3WurJGRvBPWGHwFCJ7PRkKNeroV7y11BWU9qROPVwc1x6J/exec";

        const qs = new URLSearchParams({filename: fileName, mimeType: file.type, subCode: form.subCode.value});
        console.log(`${url}?${qs}`);
        fetch(`${url}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)])})
        .then(res => res.json())
        .then(e => {
            console.log(e);
            if (e.commonFolder) {
                alert("It seems like your file went to the wrong folder. Contact the supervisor");
            }
            alert("File uploaded successfully!");
            form.reset();
            uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
            uploadMessageElement.style.display = 'block';
        })  // <--- You can retrieve the returned value here.
        .catch(err => {
            console.log(err);
            uploadMessageElement.innerHTML = 'UPLOADING FAILED';
            alert("Something went Wrong! Please Try again!");
            uploadMessageElement.style.display = 'block';
        });
    }
});