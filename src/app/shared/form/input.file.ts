import { AbstractControl } from "@angular/forms";

export function InputFileMaxValidator(max = 0, totalModel: number = 0) {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (max <= 0) {
      return null;
    }

    if (control.value) {
      let total = control.value.length;
      if (total > max) {
        control.markAsTouched();
        return { maxFiles: { max: max, actual: total } };
      }
    }

    return null;
  };
}

export function InputFileMinValidator(min = 0, totalModel: number = 0) {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (min <= 0) {
      return null;
    }

    if (control.value) {
      let requiereValidacion = true;
      const formRequired = control.validator as any;
      if (formRequired(0) === null && control.value.length === 0) {
        requiereValidacion = false;
      }
      if (requiereValidacion) {
        const total = totalModel + control.value.length;
        if (total < min) {
          control.markAsTouched();
          return { minFiles: { min: min, actual: total } };
        }
      }
    }

    return null;
  };
}

export function InputFileAcceptsValidator(accept: string) {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (accept == "" || accept == null || accept == "*") {
      return null;
    }

    if (control.value) {
      let cantidadArchivos = control.value.length;
      let i = 0;
      var tiposAceptados = "";
      var valido = false;

      while (i < cantidadArchivos) {
        if (control.value[i] != null && typeof control.value[0].name === 'string') {
          let tipoArchivo = control.value[i].type;
          var tipoArchivos = tipoArchivo.split("/");
          var tipos = accept.split(",");
          tiposAceptados = "";
          tipos.forEach(item => {
            item = item.trim();
            if (item == "*" || item == "*/*") {
              valido = true;
            }

            if (tipoArchivo == item) {
              valido = true;
            }

            var tipo = item.split("/");

            if (tipo.length > 0) {
              if (tipoArchivos[0] == tipo[0] && tipo[1] == "*") {
                valido = true;
              }
              tiposAceptados += tipo[1] + ", ";
            }
          });

          if (tiposAceptados) {
            tiposAceptados = tiposAceptados.substring(
              0,
              tiposAceptados.length - 2
            );
          }

          if (!valido) {
            control.markAsTouched();
            if (tiposAceptados === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
              tiposAceptados = 'Excel';
            }

            return {
              typeFiles: {
                actual: control.value[i].type,
                typeAccept: tiposAceptados
              }
            };
          }
        }
        i = i + 1;
      }
      return null;
    }

    return null;
  };
}

export function InputFileSize(size = 0) {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (size > 100) {
      size = 100;
    }

    if (control.value) {
      let bits = 1000000;
      let sizeBits = size * bits;
      for (let file in control.value) {
        if (control.value[file].size > sizeBits) {
          control.markAsTouched();
          return {
            sizeFile: { size: size, actual: control.value[file].size / bits }
          };
        }
      }
    }

    return null;
  };
}
