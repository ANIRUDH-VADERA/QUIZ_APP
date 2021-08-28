var heading = document.querySelector(".main_head");
var question = document.querySelector(".question");
var options = Array.from(document.querySelectorAll(".option"));
var options_div = Array.from(document.querySelectorAll(".container"));
var prev=document.querySelector(".prev");
var next=document.querySelector(".next");
var progress_fill=document.querySelector(".progress_fill");
var loader=document.querySelector(".loader");
var main=document.querySelector(".main");



var curr_ques={};
var score=0;
var questionCounter=0;
let available_questions = [];


function convert(alphabet)
{
    if(alphabet==="A")
    {
        return 1;
    }
    else if(alphabet==="B")
    {
        return 2;
    }
    else if(alphabet==="C")
    {
        return 3;
    }
    else if(alphabet==="D")
    {
        return 4;
    }
}

fetch("https://task-3-api.herokuapp.com/questions")
    .then(res=>{
        return res.json();
    })
    .then(loadedQuestions=>{
        available_questions=loadedQuestions.map((item,index)=>{
            const required_question={
                question: item.question,
                choice1: item.optionA,
                choice2: item.optionB,
                choice3: item.optionC,
                choice4: item.optionD,
                answer: convert(item.correctOption)
            }
            return required_question;
        });
        startGame();
    })
    .catch(err=>{
        console.log(err);
    });


var max=available_questions.length;

function startGame()
{
    questionCounter=0;
    score=0;
    max=available_questions.length;
    progress_fill.style.width=((questionCounter+1)/max)*100+'%';
    loader.classList.add("hidden");
    main.classList.remove("hidden");
    main.classList.add("main_hover")
    getNextQuestion();
}


function getNextQuestion()
{
    curr_ques=available_questions[questionCounter];
    heading.innerText='Question '+(questionCounter+1);
    question.innerHTML="<p>"+curr_ques.question+"</p>";
    options.map((item)=>{
        const number=item.dataset["number"]
        item.innerText=curr_ques['choice'+number];
    })
}

var selected=[];

options_div.map((item)=>{
    item.addEventListener("click",function(event){
        var circleList=Array.from(document.querySelectorAll(".circle"));
        circleList.map((item)=>{
            const list=Array.from(item.classList);
            if(list.includes("colour"))
            {
                item.classList.remove("colour");
            }
        })
        const selected_answer=event.target.dataset['number'];
        selected[questionCounter]=selected_answer;
        var circle=item.firstElementChild;
        circle.classList.add("colour")
    })
})

prev.addEventListener("click",function (){
    if(questionCounter==0)
    {
        alert("This is the start of the test");
    }
    else
    {
        next.innerText="Next"; 
        questionCounter--;
        progress_fill.style.width=((questionCounter+1)/max)*100+'%';
        var circleList=Array.from(document.querySelectorAll(".circle"));
        circleList.map((item,index)=>{
            const list=Array.from(item.classList);
            if(list.includes("colour"))
            {
                item.classList.remove("colour");
            }
            if(selected[questionCounter]==(index+1))
            {
                item.classList.add("colour");
            }
        })
        getNextQuestion();
    }   
});

next.addEventListener("click",function (){
    if((questionCounter+1)==max)
    {
        selected.map((answer,index)=>{
            if(answer==available_questions[index].answer)
            {
                score++;
            }
        })
        localStorage.setItem("mostRecentScore",score);
        localStorage.setItem("max",max);
        return window.location.assign("./results.html"); 
    }
    else
    {
        questionCounter++;
        progress_fill.style.width=((questionCounter+1)/max)*100+'%';
        if(questionCounter+1==max)
        {
            next.innerText="Submit"; 
        }
        var circleList=Array.from(document.querySelectorAll(".circle"));
        circleList.map((item,index)=>{
            const list=Array.from(item.classList);
            if(list.includes("colour"))
            {
                item.classList.remove("colour");
            }
            if(selected[questionCounter]==(index+1))
            {
                item.classList.add("colour");
            }
        })
        getNextQuestion();
    }
});
