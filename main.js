//UI("게임설명", "랜덤으로 소환되는 보물을 찾아다니는 게임입니다.\n보물을 먹으면서 점수를 얻어봅시다.\n\n<span style='color: grey;'>* 캐릭터 위치가 이상할 경우 재접속하시고, 방향키 위치가 브라우저에 따라 다르게 표시될 수 있습니다. 브라우저를 전체 화면으로 설정하거나, 우측 상단에 위치한 설정에서 방향키의 위치를 변경할 수 있으니, 브라우저에 맞춰 변경해주세요.</span>")
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');
function settingOpen() {
    document.getElementById('settingPage').style.display = "block";
}
/**
 * x, y 좌표가 element 안에 위치해 있는지 boolean 형태로 반환합니다.
 * @param {document} element 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isInside(element, x, y) {
    const rect = element.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
const speed = 2.5, delay = 5,
animationSpeed = {
    walk: 50,
    run: 17
},
moveCharacter = {
    up: 0,
    left: 0,
    right: 0,
    down: 0
};

let x = 0,
    y = 0,
    perHourX,
    perHourY,
    coordinateInterval,
    mapSize = [11, 10],
    centerCoordinate = [0, 0],
    widthInVw,
    heigthInVw,
    mapBorder = 0,
    charDelay = 0,
    /**
     * ['walk', 'run']
     */
    animation = 'walk',
    upButtonTouch = 0,
    leftButtonTouch = 0,
    rightButtonTouch = 0,
    downButtonTouch = 0;
document.body.onload = () => {
    document.getElementById('body').style.width = mapSize[0] * 10 + 'vw';
    document.getElementById('body').style.height = mapSize[1] * 10 + 'vw';
    document.getElementById('body').style.border = mapBorder + 'px solid black';
    // document.getElementById('character').style.transitionDuration = (delay*10)+"ms";

    /**
     * 캐릭터 좌표 위치로 카메라 시점을 변경합니다.
     */
    function coordinate() {
        if (45 - x - (mapBorder / document.documentElement.clientWidth) * 100 <= 0 && map()[0] - 10 + (mapBorder / document.documentElement.clientWidth) * 100 - x >= 45)
            document.body.style.marginLeft = 45 - x - (mapBorder / document.documentElement.clientWidth) * 100 + "vw";
        else if (45 - x <= 0)
            document.body.style.marginLeft = -(map()[0] - 100 + (mapBorder * 2 / document.documentElement.clientWidth) * 100) + "vw";
        else
            document.body.style.marginLeft = 0;
        if ((-y - 5 - (mapBorder / document.documentElement.clientWidth) * 100) + document.documentElement.clientHeight / 2 * 100 / document.documentElement.clientWidth <= 0 && map()[1] - 10 + (mapBorder / document.documentElement.clientWidth) * 100 - y >= (document.documentElement.clientHeight / 2 / document.documentElement.clientWidth) * 100 - 5)
            document.body.style.marginTop = "calc((" + (-y - 5 - (mapBorder / document.documentElement.clientWidth) * 100) + "vw) + 50vh)";
        else if ((document.documentElement.clientHeight / 2 / document.documentElement.clientWidth) * 100 - 5 - y <= 0)
            document.body.style.marginTop = -map()[1] + (document.documentElement.clientHeight / document.documentElement.clientWidth) * 100 - (mapBorder * 2 / document.documentElement.clientWidth) * 100 + "vw";
        else document.body.style.marginTop = 0;
        document.getElementById('character').style.transform = `translate(${x}vw, ${y}vw)`;
    }
    /**
     * 100vw, 100vh를 px 형태로 변환하여 배열 형태로 반환
     * @returns {[number, number]}
     */
    function map() {
        var widthInVw = document.getElementById('body').clientWidth * 100 / document.documentElement.clientWidth;
        heigthInVw = document.getElementById('body').clientHeight * 100 / document.documentElement.clientWidth;
        return [Math.round(widthInVw), Math.round(heigthInVw)];
    }
    x = centerCoordinate[0] * 10;
    y = -centerCoordinate[1] * 10;
    coordinate();
    document.getElementById('load').style.display = 'none';
    coordinateInterval = setInterval(() => {
        if (charDelay > 0) {
            charDelay -= 1;
            return;
        } else {
            function charDelayFunc() {
                //달리기 9~15 걷기 23~29 1칸당 1m 기준
                //달리기 17~ 걷기 50~ 1칸당 0.5m 기준
                switch (animation) {
                    case 'walk':
                        charDelay = animationSpeed.walk;
                        break;
                    case 'run':
                        charDelay = animationSpeed.run;
                        break;
                    default:
                        throw Error(`No animation found. => "${animation}"`);
                }
                document.getElementById('character').style.transition = `transform ${delay * (charDelay + 1) * 2 / 1000}s linear`;
                document.body.style.transition = `margin ${delay * (charDelay + 1) * 2 / 1000}s linear`;
            }
            if (moveCharacter.up == 1) {
                if (y <= 0) {
                    handleTouchEnd();
                    return;
                }
                charDelayFunc();
                y -= speed;
                coordinate();
            } else if (moveCharacter.left == 1) {
                if (x <= 0) {
                    handleTouchEnd();
                    return;
                }
                charDelayFunc();
                x -= speed;
                coordinate();
            } else if (moveCharacter.right == 1) {
                if (x >= map()[0] - 10) {
                    handleTouchEnd();
                    return;
                }
                charDelayFunc();
                x += speed;
                coordinate();
            } else if (moveCharacter.down == 1) {
                if (y >= map()[1] - 10) {
                    handleTouchEnd();
                    return;
                }
                charDelayFunc();
                y += speed;
                coordinate();
            }
            document.querySelector('#coordinate span').textContent = `${x / 10 - centerCoordinate[0]}, ${-y / 10 - centerCoordinate[1]}, ${perHour(x, y, delay * (charDelay + 1)) + "km/h"}`;
        }
    }, delay);
}
/**
 * 이동 방향을 설정합니다. moveCharacter의 프로퍼티 값 변경
 * @param {string} direction 
 */
function key(direction) {
    switch (direction) {
        case 'ArrowUp':
            if (moveCharacter.up == 1) break;
            stop();
            moveCharacter.up = 1;

            break;
        case 'ArrowLeft':
            if (moveCharacter.left == 1) break;
            stop();
            moveCharacter.left = 1;

            break;
        case 'ArrowRight':
            if (moveCharacter.right == 1) break;
            stop();
            moveCharacter.right = 1;

            break;
        case 'ArrowDown':
            if (moveCharacter.down == 1) break;
            stop();
            moveCharacter.down = 1;

            break;
    }
}

function handleTouchMove(event) {
    event.preventDefault();

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    resetButtonColors();

    if (isInside(upButton, touchX, touchY)) {
        upButton.style.backgroundColor = '#99c2ff';
        key('ArrowUp');
    }

    if (isInside(leftButton, touchX, touchY)) {
        leftButton.style.backgroundColor = '#99c2ff';
        key('ArrowLeft');
    }

    if (isInside(rightButton, touchX, touchY)) {
        rightButton.style.backgroundColor = '#99c2ff';
        key('ArrowRight');
    }

    if (isInside(downButton, touchX, touchY)) {
        downButton.style.backgroundColor = '#99c2ff';
        key('ArrowDown');
    }
}

function handleTouchStart(event) {
    event.preventDefault();

    resetButtonColors();

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    if (isInside(upButton, touchX, touchY)) {
        upButton.style.backgroundColor = '#99c2ff';
        key('ArrowUp');
        if (upButtonTouch <= 0) upButtonTouch = 1;
        else upButtonTouch += 1;
        setTimeout(() => {
            upButtonTouch -= 1;
        }, 500);
    } else if (isInside(leftButton, touchX, touchY)) {
        leftButton.style.backgroundColor = '#99c2ff';
        key('ArrowLeft');
        if (leftButtonTouch <= 0) leftButtonTouch = 1;
        else leftButtonTouch += 1;
        setTimeout(() => {
            leftButtonTouch -= 1;
        }, 500);
    } else if (isInside(rightButton, touchX, touchY)) {
        rightButton.style.backgroundColor = '#99c2ff'; 
        key('ArrowRight');
        if (rightButtonTouch <= 0) rightButtonTouch = 1;
        else rightButtonTouch += 1;
        setTimeout(() => {
            rightButtonTouch -= 1;
        }, 500);
    } else if (isInside(downButton, touchX, touchY)) {
        downButton.style.backgroundColor = '#99c2ff';
        key('ArrowDown');
        if (downButtonTouch <= 0) downButtonTouch = 1;
        else downButtonTouch += 1;
        setTimeout(() => {
            downButtonTouch -= 1;
        }, 500);
    } else {
        return;
    }
    if (upButtonTouch > 1 || leftButtonTouch > 1 || rightButtonTouch > 1 || downButtonTouch > 1) {
        animation = 'run';
        charDelay = Math.round(((1 - 1 / animationSpeed.walk * charDelay) / (1 / animationSpeed.run)).toFixed(1))+1;
        upButtonTouch = 0;
        leftButtonTouch = 0;
        rightButtonTouch = 0;
        downButtonTouch = 0;
    }
}
function handleTouchEnd() {
    resetButtonColors();
    animation = 'walk';
}
/**
 * 모든 방향키의 배경 색상을 디폴트로 변경합니다.
 */
function resetButtonColors() {
    stop();
    upButton.style.backgroundColor = '#b3d9ff';
    leftButton.style.backgroundColor = '#b3d9ff';
    downButton.style.backgroundColor = '#b3d9ff';
    rightButton.style.backgroundColor = '#b3d9ff';
}
/**
 * moveCharacter의 프로퍼티 값을 모두 0으로 리셋합니다.
 */
function stop() {
    moveCharacter.up = 0;
    moveCharacter.left = 0;
    moveCharacter.right = 0;
    moveCharacter.down = 0;
}
/**
 * 함수 호출시 전체화면 모드를 실행합니다.
 */
function lockFullscreen() {
    var elem = document.documentElement;

    // Lock fullscreen
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
        if (elem.lockFullscreen) {
            elem.lockFullscreen(); // Experimental API
        }
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
        if (elem.mozLockFullScreen) {
            elem.mozLockFullScreen(); // Experimental API
        }
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        if (elem.webkitLockFullscreen) {
            elem.webkitLockFullscreen(); // Experimental API
        }
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
        if (elem.msLockFullscreen) {
            elem.msLockFullscreen(); // Experimental API
        }
    }
}
/**
 * 시속을 계산하여 반환합니다. delay 인수는 ms로 입력
 * @param {number} x 
 * @param {number} y 
 * @param {number} delay
 * @returns {number}
 */
function perHour(x, y, delay) {
    if (typeof perHourX != 'number' || typeof perHourY != 'number') {
        perHourX = x;
        perHourY = y;
    }
    //1칸당 0.5m
    result = (Math.sqrt(Math.pow(x / 10 - perHourX / 10, 2) + Math.pow(y / 10 - perHourY / 10, 2)) * 2 / (delay / 1000) * 3.6).toFixed(2);
    perHourX = x;
    perHourY = y;
    return result;
}
function UI(title, content) {
    document.querySelector("body").innerHTML += `
        <div id="Popup">
            <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.3);">
            </div>
            <div style="border: 1px solid black; background-color: #ffffff; display: flex; align-items: center; flex-direction: column; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 350px; width: 70vw; border-radius: 15px; user-select: none;">
                <div style="overflow: hidden; text-overflow: ellipsis; border: 1px solid black; padding-left: 10px; padding-right: 40px; width: calc(100% - 50px); height: 50px; line-height: 50px; background-color: dodgerblue; color: #ffffff; font-weight: bold; border-top-left-radius: 15px; border-top-right-radius: 15px; text-align: center;">
                    ${title}</div>
                <div style="overflow-y: auto; width: calc(100% - 30px); min-height: 80px; max-height: 80vh; padding: 15px; word-wrap: break-word;">
                    ${content.replace(/\n/g, '<br>')}</div>
                <p onclick="document.querySelector('#Popup').remove()" style="position: absolute; margin: 0; top: 10px; right: 10px; border-radius: 5px; background-color: red; width: 30px; height: 30px; line-height: 30px; text-align: center; color: #ffffff; border: 1px solid black;">X</p>
            </div>
        </div>
        `;
}