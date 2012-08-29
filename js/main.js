//timer 
var stepTime = 200;


$(document).ready(function(){
    /***** EVENT HANDLING ****/
    $('#run').click(function(){
       run(); 
    });
    $('#forward').click(function(){
        forward(); 
    });
     $('#backward').click(function(){
        backward(); 
    });
    $('#animate').click(function(){
       animate_pointer();
    });
    $('#stop').click(function(){
       stop(); 
    });
    $('#clear').click(function(){
       clear(); 
    });
    
    $("select#speedSelect").change(function (){
        var chosenSpeed = $('select#speedSelect option:selected').text();
        if(chosenSpeed == "Slow"){
            stepTime = 600;
        }else if(chosenSpeed == "Normal"){
            stepTime = 400;
        }else if(chosenSpeed == "Fast"){
            stepTime = 200;
        }else if(chosenSpeed == "Seizure"){
            stepTime = 50;
        }else{
            stepTime = 0;
        }
    });
    
    $("select#codeSelect").change(function (){
        var chosenCode = $('select#codeSelect option:selected').text();
        if(chosenCode == "Hello World!"){
            $(userControlTextArea).val(">+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]>++++++++[<++++>-]<.>+++++++++++[<+++++>-]<.>++++++++[<+++>-]<.+++.------.--------.[-]>++++++++[<++++>-]<+.[-]++++++++++.");
        }else if(chosenCode == "Quine"){
            $(userControlTextArea).val("->+>+++>>+>++>+>+++>>+>++>>>+>+>+>++>+>>>>+++>+>>++>+>+++>>++>++>>+>>+>++>++>+>>>>+++>+>>>>++>++>>>>+>>++>+>+++>>>++>>++++++>>+>>++>+>>>>+++>>+++++>>+>+++>>>++>>++>>+>>++>+>+++>>>++>>+++++++++++++>>+>>++>+>+++>+>+++>>>++>>++++>>+>>++>+>>>>+++>>+++++>>>>++>>>>+>+>++>>+++>+>>>>+++>+>>>>+++>+>>>>+++>>++>++>+>+++>+>++>++>>>>>>++>+>+++>>>>>+++>>>++>+>+++>+>+>++>>>>>>++>>>+>>>++>+>>>>+++>+>>>+>>++>+>++++++++++++++++++>>>>+>+>>>+>>++>+>+++>>>++>>++++++++>>+>>++>+>>>>+++>>++++++>>>+>++>>+++>+>+>++>+>+++>>>>>+++>>>+>+>>++>+>+++>>>++>>++++++++>>+>>++>+>>>>+++>>++++>>+>+++>>>>>>++>+>+++>>+>++>>>>+>+>++>+>>>>+++>>+++>>>+[[->>+<<]<+]+++++[->+++++++++<]>.[+]>>[<<+++++++[->+++++++++<]>-.------------------->-[-<.<+>>]<[+]<+>>>]<<<[-[-[-[>>+<++++++[->+++++<]]>++++++++++++++<]>+++<]++++++[->+++++++<]>+<<<-[->>>++<<<]>[->>.<<]<<]");
        }else if(chosenCode == "Fibonnaci"){
            $(userControlTextArea).val("+++++++++++>+>>>>++++++++++++++++++++++++++++++++++++++++++++>++++++++++++++++++++++++++++++++<<<<<<[>[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]<[>++++++++++[-<-[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<[>>>+<<<-]>>[-]]<<]>>>[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<+>>[-]]<<<<<<<]>>>>>[++++++++++++++++++++++++++++++++++++++++++++++++.[-]]++++++++++<[->-<]>++++++++++++++++++++++++++++++++++++++++++++++++.[-]<<<<<<<<<<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<-[>>.>.<<<[-]]<<[>>+>+<<<-]>>>[<<<+>>>-]<<[<+>-]>[<+>-]<<<-]");
        }
    });

    
    //This handles global keybindings
    $(window).keydown(function(e){
        
        if(event.which == 27){
            //do something to handle the escape key
        }
        if(event.keyCode == 37){
            //left arrow
            animate_backward();
        }
        if(event.keyCode == 39){
            //right arrow
            animate_forward();
        }
        if(event.keyCode == 38){
            //up arrow
            animate_pointer();
        }
    });
    
    
    /***** BEGIN INITIALIZATION ****/
    $('.formBG').fadeTo(0,0.4);
    
    init_list($(window).width());
});

var turing_tape = [];
var head_position = 0;
var instruction_pointer = 0;
var times_executed_stacks = [];
var times_through_table = [];
var stopCheck = 0;
var forwards_instruction = -1; //
var backwards_instruction = -1; //

function find_matching_bracket(code, index)
{
    var count = 0;
    if (code.charAt(index) == '[')
    {
        count++;
        while (count !== 0)
        {
            index++;
            if (code.charAt(index) == ']')
                count--;
            if (code.charAt(index) == '[')
                count++;
        }

        return index;
    }

    if (code.charAt(index) == ']')
    {
        count++;
        while (count !== 0)
        {
            index--;
            if (code.charAt(index) == '[')
                count--;
            if (code.charAt(index) == ']')
                count++;
        }

        return index;
    }
}

function do_character(code)
{
    if (turing_tape[head_position] === undefined)
        turing_tape[head_position] = 0;
        
    if (forwards_instruction != -1) //
    { //
        instruction_pointer = forwards_instruction; //
        forwards_instruction = -1; //
    }//

    switch (code.charAt(instruction_pointer))
    {
    case '+':
    	animate_pointer();
        turing_tape[head_position]++;
        if (turing_tape[head_position] > 255)
            turing_tape[head_position] = 0;
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    case '-':
		animate_pointer();
        turing_tape[head_position]--;
        if (turing_tape[head_position] < 0)
            turing_tape[head_position] = 255;
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    case '>':
        animate_forward();
        head_position++;
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    case '<':
        animate_backward();
        head_position--;
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    case '[':
        if (turing_tape[head_position] === 0)
        { //
            backwards_instruction = instruction_pointer; //
            instruction_pointer = find_matching_bracket(code, instruction_pointer) + 1;
        } //

        else
        { //
            backwards_instruction = instruction_pointer; //
            instruction_pointer++;
        }
        
        break;
    case ']':
        if (times_through_table[instruction_pointer] === undefined)
            times_through_table[instruction_pointer] = 0;

        times_through_table[instruction_pointer]++;

        if (turing_tape[head_position] !== 0)
        { //
            backwards_instruction = instruction_pointer; //
            instruction_pointer = find_matching_bracket(code, instruction_pointer) + 1;
        } //
        
        else
        {
            if (times_executed_stacks[instruction_pointer] === undefined)
                times_executed_stacks[instruction_pointer] = [];
            times_executed_stacks[instruction_pointer].push(times_through_table[instruction_pointer]);
            times_through_table[instruction_pointer] = 0;
            backwards_instruction = instruction_pointer; //
            instruction_pointer++;
        }
        break;
    case '.':
        var newchar = String.fromCharCode(turing_tape[head_position]);
        $('#userControlOutput').val($('#userControlOutput').val()+newchar);
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    case ',':
        var input = prompt("Enter a character:", "0");
        turing_tape[head_position] = input.charCodeAt(0);
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    default:
        backwards_instruction = instruction_pointer; //
        instruction_pointer++;
        break;
    }
}

function clear_state()
{
    turing_tape = [];
    head_position = 0;
    instruction_pointer = 0;
    times_executed_stacks = [];
    times_through_table = [];
    $('#userControlOutput').val("");
    stopCheck = 0;
}

function undo_character(code)
{
    if (turing_tape[head_position] === null)
        turing_tape[head_position] = 0;
        
    if (backwards_instruction != -1) //
    { //
        instruction_pointer = backwards_instruction; //
        backwards_instruction = -1; //
    } //

    switch (code.charAt(instruction_pointer))
    {
    case '+':
		animate_pointer();
        turing_tape[head_position]--;
        if (turing_tape[head_position] < 0)
            turing_tape[head_position] = 255;
        forwards_instruction = instruction_pointer; //
        instruction_pointer--;
        break;
    case '-':
		animate_pointer();
        turing_tape[head_position]++;
        if (turing_tape[head_position] > 255)
            turing_tape[head_position] = 0;
        forwards_instruction = instruction_pointer; //
        instruction_pointer--;
        break;
    case '>':
		animate_backward();
        head_position--;
        forwards_instruction = instruction_pointer; //
        instruction_pointer--;
        break;
    case '<':
		animate_forward();
        head_position++;
        forwards_instruction = instruction_pointer; //
        instruction_pointer--;
        break;
    case '[':
        var matching_bracket = find_matching_bracket(code, instruction_pointer);
        if (times_through_table[matching_bracket] === 0)
        { //
            forwards_instruction = instruction_pointer; //
            instruction_pointer--;
        } //
        else
        {
            times_through_table[matching_bracket]--;
            forwards_instruction = instruction_pointer; //
            instruction_pointer = matching_bracket - 1;
        }
        break;
    case ']':
        if (times_executed_stacks[instruction_pointer] !== undefined)
        {
            times_through_table[instruction_pointer] = times_executed_stacks[instruction_pointer].pop();
            forwards_instruction = instruction_pointer; //
            instruction_pointer--;
        }

        else 
        {//
            forwards_instruction = instruction_pointer; //
            instruction_pointer = find_matching_bracket(code, instruction_pointer) - 1;
        } //
        break;
    case '.':
        var text = $('#userControlOutput').val();
        var newtext = text.substring(0, text.length - 1);
        $('#userControlOutput').val(newtext);
        forwards_instruction = instruction_pointer;
        instruction_pointer--;
        break;
    default:
        instruction_pointer--;
        break;
    }
}

function run_program(code)
{
    var main = setInterval(function(){
        if(instruction_pointer >= code.length || stopCheck == 1){
            clearInterval(main);
            return;
        }
        do_character(code);
        update_list();
    },stepTime);
}




function run()
{
//    var oldHP = head_position;
    var code = document.getElementById("userControlTextArea").value;
    stopCheck = 0;
    run_program(code);
//    document.getElementById("userControlTextArea").setAttribute('disabled', 'disabled');
//    while(instruction_pointer < code.length){
//        do_character(code);
//        while(oldHP > head_position){
//            animate_backward();
//            oldHP--;
//        }
//        while(oldHP < head_position){
//            animate_forward();
//            oldHP++;
//        }
//    }
//    document.getElementById("userControlTextArea").removeAttribute('disabled'); //seems to disable immediately =(
}

function forward()
{
    var code = document.getElementById("userControlTextArea").value;
    if(instruction_pointer >= code.length){
        return;
    }
    if (instruction_pointer < 0)
        instruction_pointer = 0;
    do_character(code);
    update_list();
}

function backward()
{
    var code = document.getElementById("userControlTextArea").value;
    if(instruction_pointer < 0){
        return;
    }
    if (instruction_pointer >= code.length)
        instruction_pointer = code.length - 1;
    undo_character(code);
    update_list();
}

function stop(){
    stopCheck = 1;

}

function clear()
{
    while(head_position > 0){
        animate_backward();
        head_position--;
    }
    while(head_position < 0){
        animate_forward();
        head_position++;
    }
    clear_state();
    update_list();
}
function animate_forward(){
    $('#turing_tape').animate({'left': '+=160px'}, 0);
    $('#turing_tape li:first').remove()
    add_back();
    $('#turing_tape').animate({'left': '-=160px'}, stepTime);
}
function add_back(){
    var cell = $('<li><p></p></li>')
    $(cell).attr('posit',parseInt($('#turing_tape li:last').attr('posit')) + 1);
    var cellval = turing_tape[$(cell).attr('posit')];
    if(cellval === null || cellval === undefined) cellval = 0;
    $(cell).children('p').html(cellval);
    
    $('#turing_tape').append($(cell));
    
}

function animate_backward(){
    $('#turing_tape').animate({'left': '-=160px'}, 0);
    $('#turing_tape li:last').remove()
    add_front();
    $('#turing_tape').animate({'left': '+=160px'}, stepTime);

}
function add_front(){
    var cell = $('<li><p></p></li>')
    $(cell).attr('posit',$('#turing_tape li:first').attr('posit') - 1);
    var cellval = turing_tape[$(cell).attr('posit')];
    if(cellval === null || cellval === undefined) cellval = 0;
    
	$(cell).children('p').html(cellval);
	$('#turing_tape').prepend($(cell));

}
function animate_pointer(){
    if(stepTime == 0){
        return;
    }
    var halfTime = stepTime/2;
    $('#pointer').animate({'top': '-=20px'}, halfTime);
    $('#pointer').animate({'top': '+=20px'}, halfTime);
}

function init_list(winWidth){
    $('div.tape ul').empty();
    var cell = $('<li><p></p></li>');
    $(cell).attr('posit','0');
    var cellval = turing_tape[$(cell).attr('posit')];
    if(cellval === null || cellval === undefined) cellval = 0;
    $(cell).children('p').html(cellval);
    $('div.tape ul').append($(cell));
    var cellWidth = $('#turing_tape li:first').width();
    $('#turing_tape').animate({'left': '-'+(Math.round(($(window).width()/2)/$(cell).width()) * $(cell).width()).toString()}, 'fast');

    for(var i = 0; i < (winWidth / cellWidth); i++){
        add_back();
        add_front();
    }
}

function update_list(){
    $('div.tape ul li').each(function(){
        var cellval = turing_tape[$(this).attr('posit')];
        if(cellval === null || cellval === undefined) cellval = 0;
        $(this).children('p').html(cellval);
    });
}

function update_hints(){
    $('div.tape ul li').each(function(){
        var cellval = parseInt($(this).children('p').html());
        var cellascii = String.fromCharCode(cellval);

        var hint = $('<p></p>');
        $(hint).children('p').html(cellascii);
        $(hint).css('position','absolute');

        $(this).append(hint);
     });
}