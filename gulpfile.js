import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { src, dest, watch, series } from 'gulp' // src --> es una funcion que nos permitirá acceder a ciertos archivos fuente; dest --> Es donde se van a almacenar los archivos una vez que han sido procesados
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass' // Va a la carpeta de node_modules y extrae esa dependencia; es el plugin que conecta Gulp con SASS

/*
export function hola(done) {
    console.log('Hola desde gulpfile.js');

    // Cuando se ejecute esta linea de codigo, se le avisará a gulp que ya finalizó la ejecución del código. NOTA: podemos nombrar esta funcion como queramos, pero por convencion se nombra como "done"
    done();
} */

/*En lugar de decirle donde tiene que encontrar la dependecia de SASS yendo a la carpeta node_modules/bin etc. este gulpfile hace todo ese trabajo */


// Configura gulpSass para usar dartSass como el compilador de SASS. Básicamente, esta combinación permite que Gulp compile archivos SASS a CSS.
const sass = gulpSass(dartSass);

import terser from 'gulp-terser';
import sharp from 'sharp';

export function js(done) {
    src('src/js/app.js')
        .pipe(terser())
        .pipe(dest('build/js'))
        
    done();
}

export function css(done) {
    // Ubicar el archivo scss y compilarlo con pipe(); dest() es donde queremos almacenar ese archivo compilado

    // src('src/scss/app.scss'): Especifica la ruta del archivo SASS de entrada que quieres compilar. src() es una función de Gulp que indica el archivo o archivos de origen.

    // .pipe(sass()): Utiliza el plugin gulpSass para compilar el archivo SASS. La función sass() llama a gulpSass para realizar la compilación.

    // .pipe(dest('build/css')): Especifica la carpeta de destino donde se guardará el archivo CSS compilado. dest es otra función de Gulp que define el directorio de salida.
    src('src/scss/app.scss', {sourcemaps: true}).pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError)).pipe(dest('build/css', {sourcemaps: '.'})); 

    // Lo anterior es lo mismo que tener esto: "sass --watch src/scss:built/css" en el package.json
    done();
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}

// Convertir imagenes a webp
export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)

    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}


export function dev() {
    // gulp ya incluye funciones para implementar el watch (que los cambios de sass se vean reflejados automaticamente sin tener que ejecutar el archivo desde la terminal)

    // Por todos los cambios que ocurran, en este caso, queremos escuchar la hoja de estilos "src/scss/app.scss" y cuando haya cambios ejecutara la function "css()" que definimos previamente. 

    // watch() es una función de Gulp que observa cambios en los archivos especificados (en este caso, src/scss/app.scss). Cuando detecta un cambio, ejecuta la tarea css.

    // (**/*.scss) --> ** Buscar todos los archivos; /*.scss que tengan la extencion scss.
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);
    watch('src/img/**/*.{png, jpg}', imagenes);
}

// series() -->
// parallel() --> Arranca todas las tareas al mismo tiempo
export default series(crop, js, css, imagenes, dev);