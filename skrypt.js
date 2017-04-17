canvas = document.getElementById('tetris');
context = canvas.getContext('2d');
context.scale(20, 20);

function arenaS() {
    zewn: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue zewn;
            }
        }
        wiersz = arena.splice(y, 1)[0].fill(0);
        arena.unshift(wiersz);
        ++y;
    }
}

function kolizja(arena, gracz) {
    a = gracz.tablica;
    b = gracz.pozycja;
    for (let y = 0; y < a.length; ++y) {
        for (let x = 0; x < a[y].length; ++x) {
            if (a[y][x] !== 0 &&
               (arena[y + b.y] &&
                arena[y + b.y][x + b.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function stworzTablice(szerokosc, wysokosc) {
    tablica = [];
    while (wysokosc--) tablica.push(new Array(szerokosc).fill(0));   
    return tablica;
}

function stworzKlocek(type){
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function narysujTablice(tablica, przesuniecie) {
    tablica.forEach((wiersz, y) => {
        wiersz.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = kolory[value];
                context.fillRect(x + przesuniecie.x,y + przesuniecie.y,1, 1);
            }
        });
    });
}

function rysuj() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    narysujTablice(arena, {x: 0, y: 0});
    narysujTablice(gracz.tablica, gracz.pozycja);
}

function scal(arena, gracz) {
    gracz.tablica.forEach((wiersz, y) => {
        wiersz.forEach((value, x) => {
            if (value !== 0) {
                arena[y + gracz.pozycja.y][x + gracz.pozycja.x] = value;
            }
        });
    });
}

function rotacja(tablica, kierunek) {
    for (let y = 0; y < tablica.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [tablica[x][y],tablica[y][x],] = [
                tablica[y][x],tablica[x][y],];
         }
       }

if (kierunek > 0) {
tablica.forEach(wiersz => wiersz.reverse());
} else {
 tablica.reverse();
 }
}

function spadekGracza() {
    gracz.pozycja.y++;
    if (kolizja(arena, gracz)) {
        gracz.pozycja.y--;
        scal(arena, gracz);
        reset();
        arenaS();
        
    }
    licznikSpadk = 0;
}

function RuchG(przesuniecie) {
    gracz.pozycja.x += przesuniecie;
    if (kolizja(arena, gracz)) {
        gracz.pozycja.x -= przesuniecie;
    }
}

function reset() {
    figury = 'TJLOSZI';
    gracz.tablica = stworzKlocek(figury[figury.length * Math.random() | 0]);
    gracz.pozycja.y = 0;
    gracz.pozycja.x = (arena[0].length / 2 | 0) - (gracz.tablica[0].length / 2 | 0);
    
    if (kolizja(arena, gracz)) {
        arena.forEach(wiersz => wiersz.fill(0));            
    }
}

function graczrotacja(kierunek) {
    pozycja = gracz.pozycja.x;
    let przesuniecie = 1;
    rotacja(gracz.tablica, kierunek);
    
    while (kolizja(arena, gracz)) {
        gracz.pozycja.x += przesuniecie;
        przesuniecie = -(przesuniecie + (przesuniecie > 0 ? 1 : -1));
        if (przesuniecie > gracz.tablica[0].length) {
            rotacja(gracz.tablica, -kierunek);
            gracz.pozycja.x = pozycja;
            return;
        }
    }
}

let licznikSpadk = 0;
let przedzialSpadku = 1000;
let ostatniCzas = 0;

function aktualizacja(time = 0) {
    zmianaCzasu = time - ostatniCzas;

    licznikSpadk += zmianaCzasu;
    if (licznikSpadk > przedzialSpadku) spadekGracza();
    
    ostatniCzas = time;
    rysuj();
    requestAnimationFrame(aktualizacja);
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        RuchG(-1);
    } else if (event.keyCode === 39) {
        RuchG(1);
    } else if (event.keyCode === 40) {
        spadekGracza();
    } else if (event.keyCode === 81) {
        graczrotacja(-1);
    } else if (event.keyCode === 87) {
        graczrotacja(1);
    }
});

kolory = [
    null,'yellow','green','blue','pink','brown','grey','white',
];

arena = stworzTablice(12, 20);

gracz = {
    pozycja: {x: 0, y: 0},
    tablica: null,   
};

reset();
aktualizacja();