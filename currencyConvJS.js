const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg")

for(let select of dropdowns){
    for(let currCode in currency_list){
        let newOption = document.createElement("option");
        newOption.innerText=`${currCode} - ${currency_list[currCode]}`;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected ="selected";
        }else if(select.name ==="to" && currCode ==="INR"){
            newOption.selected ="selected";
        }
        select.append(newOption);
    }
    select.addEventListener(("change"),(evt) =>{
        updateFlag(evt.target);
    });
}
const updateFlag= (element) =>{
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}
const getExchangeVal = async ()=>{
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal ==="" ||amtVal <0){
        amtVal=1;
        amount.value = 1; 
    }
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`; 
    let response = await fetch(URL); 
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()];  
    let finalfinal = rate[toCurr.value.toLowerCase()];
    let finalAmt = amtVal*finalfinal;
    msg.innerText = `${amtVal.toLocaleString("en-US")}${fromCurr.value} = ${finalAmt.toLocaleString("en-IN")}${toCurr.value}`;
}
btn.addEventListener("click", (evt)=>{  
    evt.preventDefault();
    getExchangeVal();
});
window.addEventListener("load", ()=>{
    getExchangeVal();
});