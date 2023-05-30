import inquirer from "inquirer";
import listaDeTareas from "./lista_tareas.json" assert { type: "json" };
import fs from "fs";
import chalk from "chalk";

const mostrarListaDeTareas = () => {
  if (listaDeTareas.length < 1) return console.log("No hay tareas pendientes");
  const opciones = listaDeTareas.map((tarea, index) => ({
    name: `${index + 1}.${tarea.nombre}`,
    value: tarea,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "tareaSeleccionada",
        message: "Lista de tareas",
        choices: opciones,
      },
    ])
    .then((respuesta) => {
      console.log("Tarea seleccionada:", respuesta.tareaSeleccionada);
    })
    .catch((err) => {
      console.log(err);
    });
};

const agregarTarea = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "nombre",
        message: "Ingrese nombre de la tarea.",
      },
      {
        type: "input",
        name: "descripcion",
        message: "Ingrese una descripcion de la tarea:",
      },
    ])
    .then((respuesta) => {
      const nuevaTarea = {
        nombre: respuesta.nombre,
        descripcion: respuesta.descripcion,
        completada: false,
      };
      listaDeTareas.push(nuevaTarea);
      fs.writeFile(
        "./lista_tareas.json",
        JSON.stringify(listaDeTareas),
        "utf8",
        (err) => {
          if (err) console.log("Hubo un error al guardar los datos", err);
          else console.log(chalk.yellow(`La tarea ${respuesta.nombre} fue agregada con exito`));
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};


const marcarTarea = () => {
  const opciones = listaDeTareas.map((tarea, index) => ({
    name: `${index + 1}.${tarea.nombre}`,
    value: tarea,
  }));
  inquirer
  .prompt([
    {
        type: "list",
        name: "echo",
        message: "Marque la tarea realizada",
        choices: opciones,
      },
    ])
    .then((respuesta) => {
      for (let i = 0; i < listaDeTareas.length; i++) {
        if (listaDeTareas[i].nombre === respuesta.echo.nombre && listaDeTareas[i].descripcion === respuesta.echo.descripcion)
          listaDeTareas[i].completada = true;
      }
      fs.writeFile(
        "./lista_tareas.json",
        JSON.stringify(listaDeTareas),
        "utf8",
        (err) => {
          if (err) console.log(err);
          else {
            console.log("Tarea realizada:", chalk.green(respuesta.echo.nombre));
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

const eliminarTarea = () => {
  const opciones = listaDeTareas.map((tarea, index) => ({
    name: `${index + 1}.${tarea.nombre}`,
    value: tarea,
  }));
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'eliminar',
      message: '¿Que tarea desea eliminar',
      choices: opciones
    }  
  ])
  .then(respuesta => {
    for(let i = 0; i<listaDeTareas.length;i++){
      if(listaDeTareas[i].nombre === respuesta.eliminar.nombre && listaDeTareas[i].descripcion == respuesta.eliminar.descripcion){
        listaDeTareas.splice(i,1);
        fs.writeFile('./lista_tareas.json', JSON.stringify(listaDeTareas), 'utf-8', err => {
          if(err) console.log(err);
          else console.log(chalk.red(`La tarea ${respuesta.eliminar.nombre} fue elimida con exito`))
        })
      }
    }
  })
  .catch(err => console.log(err));
};
const menuPrincipal = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "opcion",
        message: "¿Que desea hacer?",
        choices: [
          "Mostrar lista",
          "Agregar tarea",
          "Marcar como realizada",
          "Eliminar tarea",
          "Salir",
        ],
      },
    ])
    .then((respuesta) => {
      switch (respuesta.opcion) {
        case "Mostrar lista":
          mostrarListaDeTareas();
          break;
        case "Agregar tarea":
          agregarTarea();
          break;
        case "Marcar como realizada":
          marcarTarea();
          break;
        case "Eliminar tarea":
          eliminarTarea();
          break;
        case "Salir":
          console.log("Hasta luego");
          break;
        default:
          console.log("Opcion invalida");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

menuPrincipal();
