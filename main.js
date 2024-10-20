let items = item_reference;
let gacha_interval,count_gacha_interval, box_interval, boxs_animation_arrays = [];
let item_element = document.querySelector(".random_item")
let recieved_items = [];
let items_opened = [];
let box_animations = [];


items_opened = [false, false, false, false, false, false, false];
recieved_items = new Array(7).fill({"item": -1, "count": -1});

function random_item() {
  let random = Math.floor(Math.random() * items.length);
  item_element.querySelector("img").src = items[random].image;
  item_element.querySelector(".item_name").textContent = items[random].name;
  return random;
}

function random_count(start, end) {
  let random = Math.floor(Math.random() * (end) + start);
  item_element.querySelector("div.amount").innerHTML = `</br>${random}`;
  return random;
}

function set_gacha() { gacha_interval = setInterval(() => { random_item(); }, 20); }
function del_gacha() { clearInterval(gacha_interval); }

function set_count_gacha(start, end) { count_gacha_interval = setInterval(() => { random_count(start, end); }, 20); }
function del_count_gacha() { clearInterval(count_gacha_interval); }

function start_gacha() {
  let random = {"item": random_item(), "count" : random_count(1, 15)};
  set_gacha();
  setTimeout(del_gacha, 3000);
  set_count_gacha(1, 15);
  setTimeout(del_count_gacha, 3000);
  setTimeout(() => {
    item_element.querySelector("img").src = items[random.item].image;
    item_element.querySelector(".item_name").textContent = items[random.item].name;
    item_element.querySelector("div.amount").innerHTML = `</br>${random.count}`;
  }, 3001);
  return random;
}

function find_item(name) {
  let res = {"name" : "", "image" : ""};
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == name) {
      res = items[i];
      break;
    }
  }
  return res;
}

function createCloud(arg = "big") {
  let element = document.createElement("div")
  element.classList.add("cloud");
  element.classList.add(arg);

  element.append(document.createElement("img"));
  element.style.top= `${Math.floor(Math.random() * (document.body.clientHeight))}px`;
  element.style.left= `${Math.floor(Math.random() * (document.body.clientWidth + (512 / 539 * document.body.clientHeight))) - (512 / 539 * document.body.clientHeight)}px`;

  document.body.appendChild(element);
}

function createNewCloud() {
  let element = document.createElement("div")
  element.classList.add((Math.floor(Math.random() * 2 + 1) == 1) ? "big" : "small");
  element.classList.add("cloud");

  element.append(document.createElement("img"));
  element.style.top= `${Math.floor(Math.random() * (document.body.clientHeight))}px`;
  element.style.left= `${Math.floor(512 / 539 * document.body.clientHeight) * -1}px`;

  document.body.appendChild(element);
}

let cloudsInterval;
let cloudWidth;

window.onload = function() {

  createCloud("big")
  createCloud("big")
  createCloud("small")
  createCloud("small")
  createCloud("small")

  cloudsInterval = setInterval(cloudMoves,10);


  initBoxs()
  box_interval = setInterval(AnimateBox, 200);
};

function AnimateBox() {
  let elements = document.querySelectorAll(".random .boxs .box img");

  for (let i = 0; i < elements.length; i++) {
    let current = boxs_animation_arrays[i];
    if(current.now == -1) {
      current.now = current.start
    }
    else if (current.now == 13){
      boxs_animation_arrays[i] = { start : 14, end : 18, now: 14 };
      console.log("a box opened")
    }
    else {
      current.now = (current.now >= current.end) ? current.start : current.now + 1;
    }
    'if (current.now == 18 && items_opened[i])'
    elements[i].style.objectPosition = `${box_animations[current.now].x} 0px`;
  }
}

function initBoxs() {
  let one = Math.floor(document.querySelector(".boxs .box img").width / 16);

  boxs_animation_arrays.length = 0
  box_animations = [
    { x: `-${one * 0}px`},/*wait 0 ~ 4*/
    { x: `-${one * 1}px`},
    { x: `-${one * 2}px`},
    { x: `-${one * 1}px`},
    { x: `-${one * 0}px`},
    { x: `-${one * 3}px`},/*opening 5 ~ 13*/
    { x: `-${one * 4}px`},
    { x: `-${one * 5}px`},
    { x: `-${one * 6}px`},
    { x: `-${one * 7}px`},
    { x: `-${one * 8}px`},
    { x: `-${one * 9}px`},
    { x: `-${one * 10}px`},
    { x: `-${one * 11}px`},
    { x: `-${one * 12}px`},/*opened 14 ~ 18*/
    { x: `-${one * 13}px`},
    { x: `-${one * 14}px`},
    { x: `-${one * 15}px`},
    { x: `-${one * 11}px`},
  ];

  document.querySelectorAll(".random .box").forEach(() => {
    boxs_animation_arrays[boxs_animation_arrays.length] = { start : 0, end : 4, now: -1 };
  });
  document.querySelectorAll(".random .box").forEach(self=> self.addEventListener('click',
    () => {
      let i = Array.from(self.parentElement.children).indexOf(self);
      console.log(i);
      if (!(items_opened[i])) {
        boxs_animation_arrays[i] = { start : 5, end : 13, now: 4 };
        items_opened[i] = true;
        setTimeout(() => {
          recieved_items[i] = start_gacha();
          gacha_interval
        }, 1200);
      }
    }
  ));

  item_element.querySelector("img").src = find_item("Golden Mystery Box").image;
  item_element.querySelector(".item_name").textContent = "Click the 'boxes' and Get your random items"
  item_element.querySelector("div.amount").innerHTML = "</br>Good Luck!";
}

function cloudMoves() {
  cloudWidth = parseFloat(getComputedStyle(document.querySelector(".cloud img")).width);
  let clouds = document.querySelectorAll(".cloud");
  if (clouds.length != 0) {

    clouds.forEach((cloud) => {
      let left = parseFloat(getComputedStyle(cloud).left)
      if (cloud.classList.contains("big") == true) {
        cloud.style.left = `${parseFloat(left) + 0.1}px`
      }
      else {
        cloud.style.left = `${parseFloat(left) + 0.6}px`
      }

      if (left >= document.body.clientWidth) {
          cloud.remove();
          createNewCloud();
      }
    });

  }
}



function smoothScroll(target) {
  document.querySelector(".container").scrollTo({
    top: target, behavior: 'smooth'
  })
}

let next_controls = document.querySelectorAll(".next");
for (let i = 0; i < next_controls.length; i++) {
  next_controls[i].addEventListener('click', () => {
    smoothScroll(window.innerHeight * (i + 1));
  });
}

document.querySelector(".left.button").addEventListener('click', () => {
  let element = document.querySelector(".amount.text")
  let count = parseFloat(element.textContent);
  if (count <= 1) count = 1;
  else count--;

  element.textContent = count;
});

document.querySelector(".right.button").addEventListener('click', () => {
  let element = document.querySelector(".amount.text")
  let count = parseFloat(element.textContent);
  if (count >= 15) count = 15;
  else count++;

  element.textContent = count;
});

document.querySelector(".page:nth-child(2) .okay.button img").addEventListener('click', () => {
  document.querySelectorAll(".boxs .box").forEach(self=> {self.remove()});
  let count = parseFloat(document.querySelector(".amount.text").textContent);
  items_opened.length = 0
  recieved_items.length = 0

  for(let i = 0; i < count; i++) {
    let element = document.createElement("div");
    element.classList.add("box");
    element.appendChild(document.createElement("img"));
    document.querySelector(".boxs").appendChild(element);

    items_opened[i] = false;
    recieved_items[i] = {"item": -1, "count": -1};
  }

  initBoxs()
});


let command_element = document.querySelector(".receive_item .command");

document.querySelector(".page:nth-child(3) .okay.button img").addEventListener('click', () => {
  document.querySelectorAll(".box.receive").forEach(self=> {self.remove()});
  let count = recieved_items.length;

  for (let i = 0; i < count; i++) {
    let element = document.createElement("div");
    let img = document.createElement("img");
    let item_num = recieved_items[i].item;
    
    if (item_num == -1) continue;
    console.log("pasted img");
    element.classList.add("box");
    element.classList.add("receive");
    img.src = items[item_num].image;
    img.id = items[item_num].name;
    img.name = recieved_items[i].count;

    element.appendChild(img);
    document.querySelector(".result .boxs").appendChild(element);

    img.addEventListener('click', () =>{
      document.querySelector
    });
  }

  
  document.querySelectorAll(".box.receive img").forEach(self => {
    self.addEventListener('click',() => {
      command_element.textContent = 'Player_add name "'+ self.id + '" '+ self.name;
    });
  });
});

document.querySelector(".copy.button").addEventListener('click', () => {
  navigator.clipboard.writeText(document.querySelector(".receive_item .command").innerText)
});