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
