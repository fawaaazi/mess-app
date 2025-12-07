// const { error } = require("console");
// const { url } = require("inspector");

// const { url } = require("inspector");
const form = document.querySelector("form")
const table = $("table")

form.addEventListener("submit",(e)=>{
    e.preventDefault()
})

function RenderAttendenceTable(data){
    let count = 1;
    data.forEach(Element =>{
        RenderTableTr(Element);
    })
}

function RenderTableTr(Element){
    let count = 1
    const inp = $(`<input type="number" name="${Element.name}" min="0" max="31" class="input-days" >`)
    const tdInp = $(`<td class="day-field"></td>`)
    const tr = $(` <tr>
                <td>${count++}</td>
                <td><h3>${Element.name}</h3></td>
                </tr>`
            )
    tdInp.append(inp)
    tr.append(tdInp)
    table.append(tr) 
    inputPreventDefaultSubmitAndSwitching(inp)
}

function inputPreventDefaultSubmitAndSwitching(inp){
    inp.on("keydown", function(e){
        console.log("on")
        
        const inputs = $("input").toArray()
        let index = inputs.indexOf(this)
            if(e.key === "Enter"){
            e.preventDefault()
            if(inputs[index +1]){
                inputs[index +1].focus()
            }

        }

    })     
}

$.ajax({
    url:"https://mess-app-1qlz.onrender.com/",
    method: "GET",
    success:(res)=>{
        // console.log(data)    
        RenderAttendenceTable(res)   
    },
    error:(err)=>{
        console.log(err)
    }

})




function checkFormValidity(){
    if(!form.checkValidity()){
        form.reportValidity()
        return false;
    }
    return true

}

function getDaysPresent(){
    const inputsArray = document.getElementsByClassName("input-days");
        console.log(inputsArray)
        let daysPresent = [];
        for( i =0; i < inputsArray.length; i++){
             daysPresent.push({
                 name : inputsArray[i].name,
                 present : (inputsArray[i].value == '')? 0: Number.parseInt(inputsArray[i].value)
            })

        }
        return daysPresent;
}

function RenderExpenseForm(res){
    $("form").html("")
    $("form").append(`<h2> Total Number of Points ${res.totalDays}</h2>
        <div id="expense-container">
            <div id="expense-div">
                <label for="messExpense">Total Mess Expense</label><br>
                <input type="Number" min="0" name="messExpense" id="messExpense">
            </div>
                <div class="mess-alavance-div">
                <label for="alavance">Mess Alavance</label><br>
                <input type="number" name="Alavance" id="alavance">
            </div>
            <input type="submit" value="Submit" id="expense-submit-btn">
        </div>
   `)  
}

$("#submit-btn").on("click",async (e)=>{
        if(!checkFormValidity()){
            return;
        }
        let daysPresent = getDaysPresent()
        
        try{
            console.log(daysPresent)

            const response1 = await $.ajax({
                url:"https://mess-app-1qlz.onrender.com/present",
                method: "POST",
                data: JSON.stringify(daysPresent),
                contentType: "application/json",
                dataType: 'json',
            }) 
            
            RenderExpenseForm(response1)

              
        }
        catch (err){
            console.log(err)
        }
})



function getExpense(){
    let expense = {
        totalExpense : Number.parseInt($("#messExpense").val()),
        alavance : Number.parseInt($("#alavance").val())
    }
    return expense
}

function renderMessBillTable(res){

     $(".main").html(`
        <table border="1" id="mess-bill-table">
            <thead>
                <th>SI No</th>
                <th>Name</th>
                <th>No of Days Present</th>
                <th>Per Day Expense</th>
                <th>Alavance</th>
                <th>Mess Bill</th>
                <th>Total</th>
            </thead>
            <tbody>
            </tbody>
        </table>`
    )
    renderMessBillTableTr(res)
}

function renderMessBillTableTr(res){
    let count = 1;
    res.forEach(Element =>{
        const tr = $(`
            <tr>
                <td><h3>${count++}</h3></td>
                <td><h3>${Element.name}</h3></td>
                <td><h3>${Element.present}</h3></td>
                <td><h3>${Element.expensePerDay}</h3></td>
                <td><h3>${Element.alavance}</h3></td>
                <td><h3>${(Element.messExpense).toFixed(2)}</h3></td>
                <td><h3 style="color:red;">${(Element.messExpense + Element.alavance).toFixed(2)}</h3></td>
            </tr>`
    )
        $("#mess-bill-table tbody").append(tr)
    })
}

$("form").on("click","#expense-submit-btn",async (e)=>{
            e.preventDefault()
            if(!checkFormValidity()){
                return
            }
            try{
                let expense = getExpense()
                let response2 = await $.ajax({
                    url:"https://mess-app-1qlz.onrender.com/expense",
                    method: "POST",
                    data: JSON.stringify(expense),
                    contentType: "application/json",
                    dataType: 'json'
                })

                renderMessBillTable(response2)
            }
            catch(err){
                console.log(err)
            }
})
                       