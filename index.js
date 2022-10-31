let randomized = false;
$('#randomize').change(function(e){
    // console.log(e.target.checked);
    randomized = e.target.checked
})
$('#submit').click(async(event) => {
    event.preventDefault();
    let url = $('#url').val();
    let formdata = await fetchAndProcessData(url);
    await displayFormData(formdata)
        // let answers = genrateAnswers(formdata[2])
        // document.getElementById("spamcount").style.display = "block";
    $('#spamcount').show();
    $('#spam').click(async(event) => {
        event.preventDefault();
        document.getElementById('progress_bar').style.display = "block";
        let spam_count = $("#spamCountNumber").val();
        startSpamming(spam_count, formdata)
    })
})
const startSpamming = async(spamCount, formData) => {
    for (var i = 1; i <= spamCount; i++) {
        if(randomized){
            await submitResponse(formData[0], await genrateRandomAnswers(formData[2]));
        }
        else{
            await submitResponse(formData[0], await genrateAnswers(formData[2]));
        }
        document.getElementById('progress_bar').firstElementChild.style.width = (Math.ceil((i / spamCount) * 100)) + "%";
        document.getElementById('progress_bar').firstElementChild.innerHTML = (Math.ceil((i / spamCount) * 100)) + "%";

    }
    setTimeout(() => {
        alert('Form Spam Successfull');
        window.location.reload();
    }, 1000)

};
const displayFormData = async(formData) => {
    $('#formName').html('<h4>Form Title: ' + formData[1] + '</h4>');
    var forminfo = '<h4>Questions: </h4><ol>';
    formData[2].map((q, id) => (
        forminfo += `<li key=${id}>${q[1]}</li>`
    ))
    forminfo += '</ol>';
    $('#formQues').html(forminfo);
}
function makeEmail() {
    var strValues = "abcdefg12345";
    var strEmail = "";
    var strTmp;
    for (var i = 0; i < Math.floor(Math.random() * 5) + 8; i++) {
        strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
        strEmail = strEmail + strTmp;
    }
    strTmp = "";
    strEmail = strEmail + "@gmail.com"
    return strEmail;
}
const submitResponse = async(formID, answers) => {
    var queryString = "/formResponse?usp=pp_url";

    for (var i = 0; i < answers.length; i++) {
        queryString += `&entry.${answers[i][0]}=${encodeURIComponent(
      answers[i][1]
    )}`;
    }
    queryString += `&emailAddress=${makeEmail()}`;
    queryString += "&submit=SUBMIT";

    var url = "https://docs.google.com/forms/d/e/" + formID + queryString;

    var opts = {
        method: "POST",
        mode: "no-cors",
        redirect: "follow",
        referrer: "no-referrer",
    };

    return await fetch(url, opts);
};

function randomString(lenString) {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';

    for (var i = 0; i < lenString; i++) {
        var rnum = Math.floor(Math.random() * characters.length);
        randomstring += characters.substring(rnum, rnum + 1);
    }
    return randomstring;
}

const fetchAndProcessData = async(url) => {
    try {
        const res = await fetch(url).then(function(response) {
                return response.text();
            }).then((htmlStr) => {

                const data = JSON.parse(
                    htmlStr.split("var FB_PUBLIC_LOAD_DATA_ = ")[1].split(";")[0]
                );
                const formID = data[14].split("/")[1];
                const formName = data[3];
                const questions = data[1][1];

                return [formID, formName, questions];
            })
            .catch((err) => {
                console.warn('Something went wrong.', err);
            });
        return res;

    } catch (err) {
        console.log(err);
        return err.message;
    }
};

const genrateRandomAnswers = async (questions) => {
    const answers = [];
    for (var i = 0; i < questions.length; i++) {
        //text based
        if (questions[i][3] === 0 || questions[i][3] === 1) {
            answers.push([questions[i][4][0][0], randomString(10) + " " + randomString(10)]);
        }
        // option based
        else if (questions[i][3] === 2 || questions[i][3] === 3 || questions[i][3] === 4) {
            const optionsArray = questions[i][4][0][1];
            const option =
                optionsArray[Math.floor(Math.random() * optionsArray.length)];
            answers.push([questions[i][4][0][0], option[0]]);
        }
    }
    return answers;
}

const genrateAnswers = async(questions) => {
    const answers = [];
    for (var i = 0; i < questions.length; i++) {
        if (questions[i][3] === 0 || questions[i][3] === 1) {
            if(questions[i][1].toLowerCase().includes('name')){
                let res = await fetch("https://getindianname.herokuapp.com/getName").then(function(response) {
                    return response.text();
                })
                answers.push([questions[i][4][0][0],res]);
            }
            else if(questions[i][1].toLowerCase().includes('roll')){
                let roll = await fetch("https://getindianname.herokuapp.com/getRollNo").then(function(response) {
                    return response.text();
                })
                answers.push([questions[i][4][0][0],roll]);
            }
            else{
                let sentence = await fetch("https://getindianname.herokuapp.com/getSentence").then(function(response) {
                    return response.text();
                })
                answers.push([questions[i][4][0][0], sentence]);
            }
        }
        // option based
        else if (questions[i][3] === 2 || questions[i][3] === 3 || questions[i][3] === 4) {
            const optionsArray = questions[i][4][0][1];
            const option =
                optionsArray[Math.floor(Math.random() * optionsArray.length)];
            answers.push([questions[i][4][0][0], option[0]]);
        }
    }
    return answers;
};;
