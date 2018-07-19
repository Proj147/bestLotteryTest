
/*
 * generate the winning numbers and add them to the lotto table
 */
function randomNumbers(tableRow, numbersRange, strongRange) {
    var regularNumbers = drawNumbers(numbersRange.amount_to_draw, numbersRange.min_number, numbersRange.max_number);
    var strongNumbers = drawNumbers(strongRange.amount_to_draw, strongRange.min_number, strongRange.max_number);
    appendResults(false, tableRow, regularNumbers);
    appendResults(true, tableRow, strongNumbers);
}

//generate unique random array of number between minNum and maxNum 
function drawNumbers(amountToDraw, minNum, maxNum) {
    var numbersList = [];
    var drawn = 0, number;
    while (drawn < amountToDraw) {
        number = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        if (numbersList.indexOf(number) === -1) {
            numbersList[drawn] = number;
            drawn++;
        }
    }
    return numbersList;
}

//append the numbers to the winning numbers column in the widget
function appendResults(strongNumbers, tableRow, numbers) {
    var $winningNumbers = $('.winningNumbers:eq(' + tableRow + ')');
    var spanClass = strongNumbers ? 'resultBallStrong' : 'resultBall';
    for (var i = 0, max = numbers.length; i < max; i++) {
        $winningNumbers.append($('<span>', {class: spanClass, html: numbers[i]}));
    }
}

$(document).ready(function () {
    //load the data from the lotto.json file to lotto table widget
    $.getJSON("test/json/lotto.json", function (json) {
        var lotteries = json["feed"];
        var lottoryData = {
            0: {
                'imgSrc': '',
                'jackpot': '',
                'playlink': '',
                'numbersRange': {},
                'strongNumberRange': {}
            },
            1: {
                'imgSrc': '',
                'jackpot': '',
                'playlink': '',
                'numbersRange': {},
                'strongNumberRange': {}
            },
            2: {
                'lottoName': '',
                'imgSrc': '',
                'jackpot': '',
                'numbersRange': {},
                'strongNumberRange': {}
            }
        };
        for (var index = 0, max = lotteries.length; index < max; index++) {
            lottoryData[index].imgSrc = lotteries[index]["lottery_logo"].substring(1);
            lottoryData[index].jackpot = lotteries[index]["next_draw_jackpot"];
            lottoryData[index].playlink = lotteries[index]["play_link"];
            randomNumbers(index, lotteries[index]["numbers_range"], lotteries[index]["strong_number_range"]);
        }
        $(".imgCol").find('img').each(function (index, image) {
            $(image).attr("src", lottoryData[index].imgSrc);
        });
        $('.prizeContainer').each(function (index, jackpot) {
            $(jackpot).html(lottoryData[index].jackpot);
        });
        $(".btnWrap").find('.tr_tablelinks').each(function (index, button) {
            $(button).attr("href", lottoryData[index].playlink);
        });
    });
});

