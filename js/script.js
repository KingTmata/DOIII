let isDropping = false;

/* ===== MUSIC ===== */
const bgm = document.getElementById("bgm");

function playMusic(src) {
    bgm.pause();
    bgm.src = src;
    bgm.volume = 0;
    bgm.play();
    let v = 0;
    const fade = setInterval(() => {
        if (v >= 0.6) clearInterval(fade);
        bgm.volume = v;
        v += 0.05;
    }, 100);
}

playMusic("music/1.mp3");

/* ===== LOGIN ===== */
const confirmBtn = document.getElementById("confirmBtn");
const password = document.getElementById("password");
const loginPage = document.getElementById("loginPage");
const menuPage = document.getElementById("menuPage");

confirmBtn.onclick = () => {
    if (password.value === "matarkoiudoi") {
        password.blur();
        loginPage.style.display = "none";
        menuPage.style.display = "flex";
    }
};

/* ===== GAME ===== */
const gameBtn = document.getElementById("gameBtn");
const gamePage = document.getElementById("gamePage");
const backFromGame = document.getElementById("backFromGame");
const gameGrid = document.getElementById("gameGrid");

gameBtn.onclick = () => {
    password.blur();
    menuPage.style.display = "none";
    gamePage.style.display = "flex";
    playMusic("music/2.mp3");
    startGame();
};

backFromGame.onclick = () => {
    gamePage.style.display = "none";
    menuPage.style.display = "flex";
    playMusic("music/1.mp3");
};

function startGame() {
    gameGrid.innerHTML = "";
    let arr = [];
    for (let i = 1; i <= 8; i++) arr.push(i, i);
    arr.sort(() => Math.random() - 0.5);

    let first = null, lock = false, matched = 0;

    arr.forEach(n => {
        const card = document.createElement("div");
        card.className = "card";

        const front = document.createElement("div");
        front.className = "card-front";

        const back = document.createElement("div");
        back.className = "card-back";
        const img = document.createElement("img");
        img.src = `images/game/${n}.jpg`;
        back.appendChild(img);

        card.appendChild(front);
        card.appendChild(back);

        card.onclick = () => {
            if (lock || card.classList.contains("open")) return;
            card.classList.add("open");

            if (!first) {
                first = card;
            } else {
                const firstImg = first.querySelector("img").src;
                const secondImg = img.src;

                if (firstImg === secondImg) {
                    matched += 2;
                    first = null;
                    if (matched === 16) {
                        setTimeout(() => backFromGame.click(), 800);
                    }
                } else {
                    lock = true;
                    setTimeout(() => {
                        card.classList.remove("open");
                        first.classList.remove("open");
                        first = null;
                        lock = false;
                    }, 1200);
                }
            }
        };
        gameGrid.appendChild(card);
    });
}

/* ===== GALLERY ===== */
const galleryBtn = document.getElementById("galleryBtn");
const galleryPage = document.getElementById("galleryPage");
const backFromGallery = document.getElementById("backFromGallery");
const galleryImg = document.getElementById("galleryImg");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let galleryIndex = 1;
const galleryTotal = 30;

function showImg(direction) {
    if (direction === 'next') {
        galleryImg.classList.add('next');
    } else if (direction === 'prev') {
        galleryImg.classList.add('prev');
    }
    setTimeout(() => {
        galleryImg.src = `images/picture/${galleryIndex}.jpg`;
        galleryImg.classList.remove('next', 'prev');
    }, 500);
}

galleryBtn.onclick = () => {
    password.blur();
    menuPage.style.display = "none";
    galleryPage.style.display = "flex";
    galleryImg.src = `images/picture/${galleryIndex}.jpg`;
};

backFromGallery.onclick = () => {
    galleryPage.style.display = "none";
    menuPage.style.display = "flex";
};


nextBtn.onclick = () => {
    if (galleryIndex < galleryTotal) {
        galleryIndex++;
        showImg('next');
    }
};

prevBtn.onclick = () => {
    if (galleryIndex > 1) {
        galleryIndex--;
        showImg('prev');
    }
};

/* ===== COOKING GAME ===== */
const cookingBtn = document.getElementById("cookingBtn");
const cookingPage = document.getElementById("cookingPage");
const backFromCooking = document.getElementById("backFromCooking");

// State variables
let ingredientCounts = { flour: 0, sugar: 0, egg: 0, milk: 0 };
let temperature = 0;
let bakingTime = 0;
let selectedCream = "#ffe4e1";
let selectedDecoration = null;
let decorations = [];
let isMixed = false;
let isBaking = false;
let hasCracks = false;

// DOM Elements
let bowl, cake, creamCake, decoratedCake, resultCake;

// Mixing animation variables
let mixingAnimationId = null;

cookingBtn.onclick = () => {
    password.blur();
    menuPage.style.display = "none";
    cookingPage.style.display = "flex";
    playMusic("music/2.mp3");
    resetCookingGame();
};

backFromCooking.onclick = () => {
    cookingPage.style.display = "none";
    menuPage.style.display = "flex";
    playMusic("music/1.mp3");
};

function resetCookingGame() {
    ingredientCounts = { flour: 0, sugar: 0, egg: 0, milk: 0 };
    temperature = 0;
    bakingTime = 0;
    decorations = [];
    selectedDecoration = null;
    selectedCream = "#ffe4e1";
    isMixed = false;
    isBaking = false;
    hasCracks = false;

    // Stop any ongoing animations
    if (mixingAnimationId) {
        cancelAnimationFrame(mixingAnimationId);
        mixingAnimationId = null;
    }

    document.querySelectorAll('.cooking-step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById('step1').style.display = 'flex';

    // Reset counters
    document.querySelectorAll('.count-num').forEach(el => el.textContent = '0');

    // Reset sliders
    const tempSlider = document.getElementById('tempSlider');
    const tempValue = document.getElementById('tempValue');
    const timeSlider = document.getElementById('timeSlider');
    const timeValue = document.getElementById('timeValue');

    if (tempSlider) tempSlider.value = 0;
    if (tempValue) tempValue.textContent = 0;
    if (timeSlider) timeSlider.value = 0;
    if (timeValue) timeValue.textContent = 0;

    // Get DOM elements
    bowl = document.getElementById('bowl');
    cake = document.getElementById('cake');
    creamCake = document.getElementById('creamCake');
    decoratedCake = document.getElementById('decoratedCake');
    resultCake = document.getElementById('resultCake');

    // Reset bowl
    if (bowl) {
        bowl.classList.remove('mixing', 'flour-added', 'sugar-added', 'egg-added', 'milk-added');
        document.querySelectorAll('.ingredient-level').forEach(el => {
            el.style.height = '0%';
            el.style.display = 'none';
        });
        document.querySelector('.egg-level').style.display = 'none';
    }

    // Reset cake
    if (cake) {
        cake.classList.remove('baking', 'cracked');
        cake.style.height = '250px';
        cake.style.background = 'linear-gradient(45deg, #f5e1da 0%, #e8c4b8 100%)';

        // Xóa vết nứt
        const cracks = cake.querySelectorAll('.cake-cracks');
        cracks.forEach(crack => crack.remove());
    }

    // Reset cream cake
    if (creamCake) {
        creamCake.classList.remove('creamed');
        creamCake.style.setProperty('--cream-color', selectedCream);
    }

    // Reset decorated cake
    if (decoratedCake) {
        decoratedCake.classList.remove('creamed');
        decoratedCake.style.setProperty('--cream-color', selectedCream);
        // Clear decorations
        const existingDecorations = decoratedCake.querySelectorAll('.decoration-element');
        existingDecorations.forEach(el => el.remove());
    }

    // Reset result cake
    if (resultCake) {
        resultCake.style.setProperty('--cream-color', selectedCream);
        const existingDecorations = resultCake.querySelectorAll('.decoration-element');
        existingDecorations.forEach(el => el.remove());
    }

    // Reset status
    const doughStatus = document.getElementById('doughStatus');
    if (doughStatus) {
        doughStatus.textContent = '';
        doughStatus.className = 'status-message';
    }

    // Reset buttons
    const startBtn = document.getElementById('startBaking');
    const rebakeBtn = document.getElementById('rebakeBtn');
    const mixBtn = document.getElementById('mixBtn');
    const nextBtn1 = document.getElementById('nextStep1');
    if (startBtn) startBtn.style.display = 'block';
    if (rebakeBtn) rebakeBtn.style.display = 'none';
    if (mixBtn) mixBtn.style.display = 'none';
    if (nextBtn1) nextBtn1.style.display = 'none';

    // Setup step 1
    setupStep1();
}

/* ===== STEP 1: MIXING ===== */
function setupStep1() {
    const ingredients = document.querySelectorAll('.ingredient');
    const nextBtn = document.getElementById('nextStep1');
    const resetBtn = document.getElementById('resetIngredients');
    const mixBtn = document.getElementById('mixBtn');

    // Ẩn nút tiếp theo ban đầu
    if (nextBtn) nextBtn.style.display = 'none';

    ingredients.forEach(ingredient => {
        ingredient.draggable = true;

        ingredient.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('item', e.target.closest('.ingredient').dataset.item);
            e.target.closest('.ingredient').classList.add('dragging');
        });

        ingredient.addEventListener('dragend', () => {
            ingredients.forEach(ing => ing.classList.remove('dragging'));
        });
    });

    if (bowl) {
        bowl.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        bowl.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.dataTransfer.getData('item');
            if (!item) return;

            ingredientCounts[item]++;

            // Animation effect
            bowl.classList.add(item + '-added');
            setTimeout(() => {
                bowl.classList.remove(item + '-added');
            }, 500);

            // Update counter
            const countEl = document.querySelector(`[data-item="${item}"] .count-num`);
            if (countEl) {
                countEl.textContent = ingredientCounts[item];
            }

            // Update bowl visual
            updateBowlVisual(item);

            checkDoughStatus();

            // Show mix button if at least one ingredient
            if (Object.values(ingredientCounts).some(count => count > 0)) {
                if (mixBtn) mixBtn.style.display = 'block';
            }

            // Check if all ingredients are present and đã trộn
            if (isMixed && ingredientCounts.flour >= 1 && ingredientCounts.sugar >= 1 &&
                ingredientCounts.egg >= 1 && ingredientCounts.milk >= 1) {
                if (nextBtn) nextBtn.style.display = 'block';
            }

            if (Object.values(ingredientCounts).some(count => count > 9)) {
                if (resetBtn) resetBtn.style.display = 'block';
            }
        });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'flex';
            setupStep2();
        };
    }

    if (resetBtn) {
        resetBtn.onclick = () => {
            ingredientCounts = { flour: 0, sugar: 0, egg: 0, milk: 0 };
            isMixed = false;
            document.querySelectorAll('.count-num').forEach(el => el.textContent = '0');

            // Stop mixing animation
            if (mixingAnimationId) {
                cancelAnimationFrame(mixingAnimationId);
                mixingAnimationId = null;
            }
            if (bowl) bowl.classList.remove('mixing');

            // Reset bowl visual
            document.querySelectorAll('.ingredient-level').forEach(el => {
                el.style.height = '0%';
                el.style.display = 'none';
            });
            document.querySelector('.egg-level').style.display = 'none';
            document.querySelector('.mixed-dough').style.height = '0%';

            checkDoughStatus();
            if (nextBtn) nextBtn.style.display = 'none';
            if (resetBtn) resetBtn.style.display = 'none';
            if (mixBtn) mixBtn.style.display = 'none';
        };
    }

    if (mixBtn) {
        mixBtn.onclick = () => {
            if (!isMixed) {
                startMixingAnimation();
                isMixed = true;

                // After animation, show mixed dough
                setTimeout(() => {
                    if (mixingAnimationId) {
                        cancelAnimationFrame(mixingAnimationId);
                        mixingAnimationId = null;
                    }
                    if (bowl) bowl.classList.remove('mixing');

                    // Show mixed dough
                    const mixedDough = document.querySelector('.mixed-dough');
                    const totalHeight = Math.min((ingredientCounts.flour + ingredientCounts.sugar + ingredientCounts.egg + ingredientCounts.milk) * 15, 80);
                    mixedDough.style.height = totalHeight + '%';
                    mixedDough.style.display = 'block';

                    // Hide individual ingredients
                    document.querySelectorAll('.flour-level, .sugar-level, .milk-level').forEach(el => {
                        el.style.height = '0%';
                    });
                    document.querySelector('.egg-level').style.display = 'none';

                    checkDoughStatus();
                    if (mixBtn) mixBtn.style.display = 'none';

                    // Hiện nút tiếp theo nếu đủ nguyên liệu
                    if (ingredientCounts.flour >= 1 && ingredientCounts.sugar >= 1 &&
                        ingredientCounts.egg >= 1 && ingredientCounts.milk >= 1) {
                        if (nextBtn) nextBtn.style.display = 'block';
                    }
                }, 2000);
            }
        };
    }
}

function updateBowlVisual(item) {
    if (!bowl) return;

    switch(item) {
        case 'flour':
            const flourLevel = document.querySelector('.flour-level');
            flourLevel.style.height = Math.min(ingredientCounts.flour * 15, 80) + '%';
            flourLevel.style.display = 'block';
            break;
        case 'sugar':
            const sugarLevel = document.querySelector('.sugar-level');
            sugarLevel.style.height = Math.min(ingredientCounts.sugar * 15, 80) + '%';
            sugarLevel.style.display = 'block';
            break;
        case 'egg':
            const eggLevel = document.querySelector('.egg-level');
            sugarLevel.style.height = Math.min(ingredientCounts.sugar * 15, 80) + '%';
            eggLevel.style.display = 'block';
            // Position eggs
            if (ingredientCounts.egg === 1) {
                eggLevel.style.left = '50%';
                eggLevel.style.transform = 'translateX(-50%)';
            } else if (ingredientCounts.egg === 2) {
                eggLevel.style.left = '30%';
                // Create second egg if needed
                if (!document.querySelector('.egg-level:nth-child(4)')) {
                    const secondEgg = eggLevel.cloneNode(true);
                    secondEgg.style.left = '70%';
                    bowl.appendChild(secondEgg);
                }
            }
            break;
        case 'milk':
            const milkLevel = document.querySelector('.milk-level');
            milkLevel.style.height = Math.min(ingredientCounts.milk * 20, 80) + '%';
            milkLevel.style.display = 'block';
            break;
    }
}

function startMixingAnimation() {
    if (!bowl) return;

    bowl.classList.add('mixing');
    let startTime = null;

    function animateMixing(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < 2000) { // Mix for 2 seconds
            mixingAnimationId = requestAnimationFrame(animateMixing);
        }
    }

    mixingAnimationId = requestAnimationFrame(animateMixing);
}

function checkDoughStatus() {
    const statusDiv = document.getElementById('doughStatus');
    if (!statusDiv) return;

    let message = '';
    let statusClass = '';

    if (ingredientCounts.flour > 9) {
        message = '⚠️ Quá nhiều bột! Bánh sẽ khô và cứng!';
        statusClass = 'warning';
    } else if (ingredientCounts.milk > 9) {
        message = '⚠️ Quá nhiều sữa! Bánh sẽ nhão và không đông!';
        statusClass = 'warning';
    } else if (ingredientCounts.sugar > 9) {
        message = '⚠️ Quá nhiều đường! Bánh sẽ quá ngọt và dễ cháy!';
        statusClass = 'warning';
    } else if (ingredientCounts.egg > 9) {
        message = '⚠️ Quá nhiều trứng! Bánh sẽ tanh và dai!';
        statusClass = 'warning';
    } else if (ingredientCounts.flour >= 1 && ingredientCounts.milk >= 1 &&
               ingredientCounts.sugar >= 1 && ingredientCounts.egg >= 1) {
        if (isMixed) {
            message = '✅ đã trộn ,nướng i!';
            statusClass = 'success';
        } else {
            message = '✅ Đủ nguyên liệu! Nhấn "Trộn bột" để trộn!';
            statusClass = '';
        }
    } else if (Object.values(ingredientCounts).some(count => count > 0)) {
        message = '';
        statusClass = '';
    } else {
        message = "";
        statusClass = '';
    }

    statusDiv.textContent = message;
    statusDiv.className = `status-message ${statusClass}`;
}

/* ===== STEP 2: BAKING ===== */
function setupStep2() {
    const tempSlider = document.getElementById('tempSlider');
    const tempValue = document.getElementById('tempValue');
    const timeSlider = document.getElementById('timeSlider');
    const timeValue = document.getElementById('timeValue');
    const startBtn = document.getElementById('startBaking');
    const rebakeBtn = document.getElementById('rebakeBtn');
    const progress = document.getElementById('baking-progress');
    const statusDiv = document.getElementById('bakeStatus');
    const nextBtn = document.getElementById('nextStep2');

    // Ẩn nút tiếp theo ban đầu
    if (nextBtn) nextBtn.style.display = 'none';

    if (tempSlider && tempValue) {
        tempSlider.oninput = () => {
            temperature = parseInt(tempSlider.value);
            tempValue.textContent = temperature;
        };
    }

    if (timeSlider && timeValue) {
        timeSlider.oninput = () => {
            bakingTime = parseInt(timeSlider.value);
            timeValue.textContent = bakingTime;
        };
    }

    if (startBtn) {
        startBtn.onclick = () => {
            if (isBaking) return;

            isBaking = true;
            startBtn.style.display = 'none';

            // Add baking class for rising effect
            if (cake) cake.classList.add('baking');

            let time = 0;
            const duration = 3000;

            // Màu sắc bánh theo thời gian nướng
            const cakeColors = {
                raw: '#f5e1da',      // Màu trắng - sống
                undercooked: '#f0d9b5', // Màu vàng nhạt - chưa chín
                perfect: '#e6b78c',    // Màu vàng nâu - chín vừa
                overcooked: '#c9a37c', // Màu nâu - quá chín
                burned: '#8b4513'      // Màu nâu đậm - cháy
            };

            // Hiệu ứng chuyển màu mượt
            function getCakeColor(percent) {
                if (temperature < 160) {
                    // Nhiệt độ quá thấp - bánh sống
                    return cakeColors.raw;
                } else if (temperature > 200) {
                    // Nhiệt độ quá cao - tính thời gian cháy nhanh hơn
                    const burnSpeed = 1.5;
                    const burnPercent = percent * burnSpeed;

                    if (burnPercent < 30) return interpolateColor(cakeColors.raw, cakeColors.undercooked, burnPercent / 30);
                    else if (burnPercent < 60) return interpolateColor(cakeColors.undercooked, cakeColors.perfect, (burnPercent - 30) / 30);
                    else if (burnPercent < 90) return interpolateColor(cakeColors.perfect, cakeColors.overcooked, (burnPercent - 60) / 30);
                    else return interpolateColor(cakeColors.overcooked, cakeColors.burned, Math.min((burnPercent - 90) / 30, 1));
                } else {
                    // Nhiệt độ bình thường
                    if (percent < 30) return interpolateColor(cakeColors.raw, cakeColors.undercooked, percent / 30);
                    else if (percent < 60) return interpolateColor(cakeColors.undercooked, cakeColors.perfect, (percent - 30) / 30);
                    else if (percent < 90) return interpolateColor(cakeColors.perfect, cakeColors.overcooked, (percent - 60) / 30);
                    else return interpolateColor(cakeColors.overcooked, cakeColors.burned, Math.min((percent - 90) / 30, 1));
                }
            }

            // Hàm chuyển đổi màu mượt
            function interpolateColor(color1, color2, factor) {
                const hex = color => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                };

                const rgb1 = hex(color1);
                const rgb2 = hex(color2);

                if (!rgb1 || !rgb2) return color1;

                const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
                const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
                const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

                return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            }

            const interval = setInterval(() => {
                time += 100;
                const percent = Math.min((time / duration) * 100, 100);

                if (progress) {
                    progress.textContent = `Đang nướng... ${Math.floor(percent)}%`;
                }

                // Cập nhật màu bánh theo tiến độ
                if (cake) {
                    const currentColor = getCakeColor(percent);

                    // Thêm hiệu ứng gradient để màu tự nhiên hơn
                    cake.style.background = `linear-gradient(45deg, ${currentColor} 0%, ${darkenColor(currentColor, 20)} 100%)`;
                }

                // Check for cracks (if temperature too high)
                if (temperature > 200 && percent > 50 && !hasCracks) {
                    hasCracks = true;
                    if (cake) {
                        cake.classList.add('cracked');

                        // Thêm hiệu ứng vết nứt màu đen
                        const cracks = document.createElement('div');
                        cracks.className = 'cake-cracks';
                        cracks.innerHTML = '&#x26A0;';
                        cracks.style.position = 'absolute';
                        cracks.style.top = '30%';
                        cracks.style.left = '50%';
                        cracks.style.transform = 'translate(-50%, -50%)';
                        cracks.style.fontSize = '24px';
                        cracks.style.color = '#655555';
                        cracks.style.zIndex = '4';
                        cake.appendChild(cracks);
                    }
                }

                if (time >= duration) {
                    clearInterval(interval);
                    isBaking = false;
                    if (progress) progress.textContent = "✅ Nướng xong!";

                    // Xác định màu cuối cùng dựa trên kết quả
                    let finalColor;
                    if (temperature < 160) {
                        finalColor = cakeColors.raw; // Trắng - sống
                    } else if (temperature > 200) {
                        finalColor = cakeColors.burned; // Nâu đậm - cháy
                    } else if (temperature >= 170 && temperature <= 190 && bakingTime >= 25 && bakingTime <= 35) {
                        finalColor = cakeColors.perfect; // Vàng nâu - hoàn hảo
                    } else if (temperature >= 160 && temperature <= 170) {
                        finalColor = cakeColors.undercooked; // Vàng nhạt - hơi sống
                    } else {
                        finalColor = cakeColors.overcooked; // Nâu - hơi quá
                    }

                    // Áp dụng màu cuối cùng
                    if (cake) {
                        cake.style.background = `linear-gradient(45deg, ${finalColor} 0%, ${darkenColor(finalColor, 20)} 100%)`;
                        cake.classList.remove('baking');
                    }

                    checkBakingResult();

                    if (nextBtn) nextBtn.style.display = 'block';
                    if (rebakeBtn) rebakeBtn.style.display = 'block';
                }
            }, 100);

            // Hàm làm tối màu
            function darkenColor(color, percent) {
                const num = parseInt(color.replace("#", ""), 16);
                const amt = Math.round(2.55 * percent);
                const R = (num >> 16) - amt;
                const G = (num >> 8 & 0x00FF) - amt;
                const B = (num & 0x0000FF) - amt;
                return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
            }
        };
    }

    if (rebakeBtn) {
        rebakeBtn.onclick = () => {
            hasCracks = false;
            isBaking = false;
            if (startBtn) startBtn.style.display = 'block';
            if (rebakeBtn) rebakeBtn.style.display = 'none';
            if (progress) progress.textContent = '';
            if (statusDiv) statusDiv.textContent = '';
            if (nextBtn) nextBtn.style.display = 'none';
            if (cake) {
                cake.classList.remove('cracked', 'baking');
                cake.style.height = '250px';
                cake.style.background = 'linear-gradient(45deg, #f5e1da 0%, #e8c4b8 100%)';

                // Xóa vết nứt
                const cracks = cake.querySelectorAll('.cake-cracks');
                cracks.forEach(crack => crack.remove());
            }
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'flex';
            setupStep3();
        };
    }
}

function checkBakingResult() {
    const statusDiv = document.getElementById('bakeStatus');
    if (!statusDiv) return;

    let message = '';
    let statusClass = 'success';

    if (temperature < 160) {
        message = '❌ Nhiệt độ thấp qa! Bánh sẽ sống!';
        statusClass = 'error';
    } else if (temperature > 200) {
        message = '❌ Nhiệt độ cao qa! Bánh sẽ cháy và nứt!';
        statusClass = 'error';
    } else if (bakingTime < 20) {
        message = '❌ Nướng nhanh qa! Bánh chưa chín!';
        statusClass = 'error';
    } else if (bakingTime > 40) {
        message = '❌ Nướng lâu qa! Bánh sẽ cứng!';
        statusClass = 'error';
    } else if (temperature >= 170 && temperature <= 190 && bakingTime >= 25 && bakingTime <= 35) {
        message = 'Bánh chín oi';
        statusClass = 'success';
    } else {
        message = '⚠️ Bánh chín nma dở:)) !';
        statusClass = 'warning';
    }

    statusDiv.textContent = message;
    statusDiv.className = `status-message ${statusClass}`;
}

/* ===== STEP 3: CREAM ===== */
function setupStep3() {
    // Select cream color
    const colors = document.querySelectorAll('.cream-color');

    // Hiển thị kem mặc định ngay khi vào bước 3
    if (creamCake) {
        creamCake.style.setProperty('--cream-color', selectedCream);
        creamCake.classList.add('creamed');
    }

    colors.forEach(color => {
        color.onclick = () => {
            colors.forEach(c => c.classList.remove('active'));
            color.classList.add('active');
            selectedCream = color.dataset.color;

            // Update cream color on cake với hiệu ứng
            if (creamCake) {
                creamCake.style.setProperty('--cream-color', selectedCream);
                creamCake.classList.add('creamed');

                // Hiệu ứng kem mới
                const creamLayer = creamCake.querySelector('.cream-layer');
                if (creamLayer) {
                    creamLayer.style.animation = 'none';
                    setTimeout(() => {
                        creamLayer.style.animation = 'creamFlow 0.8s ease-out';
                    }, 10);
                }
            }

            // Cập nhật preview cho bước sau
            if (decoratedCake) {
                decoratedCake.style.setProperty('--cream-color', selectedCream);
                decoratedCake.classList.add('creamed');
            }

            if (resultCake) {
                resultCake.style.setProperty('--cream-color', selectedCream);
                resultCake.classList.add('creamed');
            }
        };
    });

    document.getElementById('nextStep3').onclick = () => {
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step4').style.display = 'flex';
        setupStep4();
    };
}

/* ===== STEP 4: DECORATION ===== */
function setupStep4() {
    // Select decorations
    const decorItems = document.querySelectorAll('.decoration-item');
    decorItems.forEach(item => {
        item.onclick = () => {
            decorItems.forEach(d => d.classList.remove('selected'));
            item.classList.add('selected');
            selectedDecoration = item.dataset.deco;
        };
    });

    // Click on cake to add decoration - CHỈ TRONG TAM GIÁC
    if (decoratedCake) {
        decoratedCake.onclick = (e) => {
            if (!selectedDecoration) {
                alert('Vui lòng chọn đồ trang trí trước!');
                return;
            }

            const rect = decoratedCake.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Kiểm tra xem click có nằm trong tam giác không
            // Tam giác với đỉnh ở giữa trên, 2 góc dưới
            const width = rect.width;
            const height = rect.height;

            // Tọa độ tam giác: đỉnh trên (50%, 0), trái dưới (0, 100%), phải dưới (100%, 100%)
            const triangleTopX = width / 2;
            const triangleTopY = 0;
            const triangleLeftX = 0;
            const triangleLeftY = height;
            const triangleRightX = width;
            const triangleRightY = height;

            // Hàm kiểm tra điểm trong tam giác
            function isInTriangle(px, py) {
                const areaOrig = Math.abs(
                    (triangleRightX - triangleLeftX) * (triangleTopY - triangleLeftY) -
                    (triangleTopX - triangleLeftX) * (triangleRightY - triangleLeftY)
                );

                const area1 = Math.abs(
                    (triangleLeftX - px) * (triangleTopY - py) -
                    (triangleTopX - px) * (triangleLeftY - py)
                );

                const area2 = Math.abs(
                    (triangleTopX - px) * (triangleRightY - py) -
                    (triangleRightX - px) * (triangleTopY - py)
                );

                const area3 = Math.abs(
                    (triangleRightX - px) * (triangleLeftY - py) -
                    (triangleLeftX - px) * (triangleRightY - py)
                );

                return Math.abs(area1 + area2 + area3 - areaOrig) < 1;
            }

            // Chỉ thêm trang trí nếu click trong tam giác
            if (isInTriangle(x, y)) {
                decorations.push({
                    emoji: selectedDecoration,
                    x: x,
                    y: y,
                    size: Math.random() * 20 + 20
                });

                // Add decoration element
                const decorationEl = document.createElement('div');
                decorationEl.className = 'decoration-element';
                decorationEl.textContent = selectedDecoration;
                decorationEl.style.position = 'absolute';
                decorationEl.style.left = x + 'px';
                decorationEl.style.top = y + 'px';
                decorationEl.style.fontSize = decorations[decorations.length-1].size + 'px';
                decorationEl.style.transform = 'translate(-50%, -50%)';
                decorationEl.style.zIndex = '3';
                decorationEl.style.pointerEvents = 'none';
                decorationEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
                decorationEl.style.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';

                decoratedCake.appendChild(decorationEl);
            }
        };
    }

    document.getElementById('finishCooking').onclick = () => {
        document.getElementById('step4').style.display = 'none';
        document.getElementById('result').style.display = 'flex';
        showFinalResult();
    };
}

/* ===== FINAL RESULT ===== */
function showFinalResult() {
    // Clear previous decorations on result cake
    if (resultCake) {
        const existingDecorations = resultCake.querySelectorAll('.decoration-element');
        existingDecorations.forEach(el => el.remove());

        // Add decorations from step 4
        decorations.forEach(deco => {
            const decorationEl = document.createElement('div');
            decorationEl.className = 'decoration-element';
            decorationEl.textContent = deco.emoji;
            decorationEl.style.position = 'absolute';
            decorationEl.style.left = (deco.x * 1.167) + 'px'; // Scale for larger cake
            decorationEl.style.top = (deco.y * 1.1) + 'px';
            decorationEl.style.fontSize = (deco.size * 1.1) + 'px';
            decorationEl.style.transform = 'translate(-50%, -50%)';
            decorationEl.style.zIndex = '3';
            decorationEl.style.pointerEvents = 'none';
            decorationEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
            decorationEl.style.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';

            resultCake.appendChild(decorationEl);
        });
    }

    const resultMessage = document.getElementById('resultMessage');
    if (!resultMessage) return;

    let score = 100;
    let messages = [];

    // Ingredient penalties
    if (ingredientCounts.flour > 3) {
        score -= 20;
        messages.push('Bánh hơi khô vì quá nhiều bột');
    }
    if (ingredientCounts.milk > 3) {
        score -= 20;
        messages.push('Bánh hơi nhão vì quá nhiều sữa');
    }
    if (ingredientCounts.sugar > 3) {
        score -= 15;
        messages.push('Bánh hơi ngọt vì quá nhiều đường');
    }
    if (ingredientCounts.egg > 3) {
        score -= 15;
        messages.push('Bánh hơi tanh vì quá nhiều trứng');
    }

    // Baking penalties
    if (temperature < 160 || temperature > 200) {
        score -= 25;
        messages.push('Nhiệt độ nướng chưa phù hợp');
    }
    if (bakingTime < 20 || bakingTime > 40) {
        score -= 25;
        messages.push('Thời gian nướng chưa phù hợp');
    }

    // Crack penalty
    if (hasCracks) {
        score -= 30;
        messages.push('Bánh bị nứt do nhiệt độ quá cao');
    }

    let finalText = '';
    let messageClass = '';

    if (score >= 90) {
        finalText = '🌟 yayyyy! 🌟<br>Doi làm masterchef a';
        messageClass = 'perfect';
    } else if (score >= 70) {
        finalText = '😊 TỐT LẮM! 😊<br>Bánh của bạn rất ngon!';
        messageClass = 'good';
        if (messages.length > 0) {
            finalText += '<br><small>' + messages.join(', ') + '</small>';
        }
    } else {
        finalText = '😅 CÓ THỂ CẢI THIỆN! 😅<br>Hãy thử lại nhé!';
        messageClass = 'bad';
        if (messages.length > 0) {
            finalText += '<br><small>' + messages.join(', ') + '</small>';
        }
    }

    resultMessage.innerHTML = finalText;
    resultMessage.className = `result-message ${messageClass}`;

    // Save PNG button
    const savePNGBtn = document.getElementById('saveCakePNG');
    if (savePNGBtn) {
        savePNGBtn.onclick = () => {
            // Create a canvas to draw the cake
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = 350;
            canvas.height = 300;

            // Vẽ bánh tam giác
            ctx.fillStyle = '#d2d2d2';
            ctx.beginPath();
            ctx.moveTo(175, 50);  // Đỉnh trên
            ctx.lineTo(325, 250); // Góc phải dưới
            ctx.lineTo(25, 250);  // Góc trái dưới
            ctx.closePath();
            ctx.fill();

            // Vẽ kem
            ctx.fillStyle = selectedCream;
            ctx.beginPath();
            ctx.moveTo(175, 60);
            ctx.lineTo(315, 240);
            ctx.lineTo(35, 240);
            ctx.closePath();
            ctx.fill();

            // Hiệu ứng kem chảy
            ctx.fillStyle = selectedCream;
            ctx.beginPath();
            ctx.ellipse(175, 245, 150, 20, 0, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ trang trí
            decorations.forEach(deco => {
                ctx.font = `${deco.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Chuyển tọa độ từ tam giác nhỏ sang tam giác lớn
                const scaleX = 300 / 200;  // width scale
                const scaleY = 200 / 250;  // height scale
                const x = 175 + (deco.x - 100) * scaleX;
                const y = 150 + (deco.y - 125) * scaleY;

                ctx.fillText(deco.emoji, x, y);
            });

            // Convert to data URL and create image
            const dataURL = canvas.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = dataURL;
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.borderRadius = '15px';
            img.style.boxShadow = '0 0 15px rgba(255,105,180,0.6)';
            img.style.margin = '10px';
            img.style.objectFit = 'cover';

            document.getElementById('cakeGallery').appendChild(img);

            // Notification
            alert('Bánh đã được lưu vào gallery!');
        };
    }
}

document.getElementById('restartCooking').onclick = () => {
    resetCookingGame();
};

/* ===== COMET HEART ===== */
document.addEventListener("mousemove", e => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "💖";
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
});

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cookingPage')) {
        resetCookingGame();
    }
});





