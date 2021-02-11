import { Injectable } from '@angular/core';
import * as PDF from 'jspdf';
import 'jspdf-autotable';

const PDF_EXTENSION = '.pdf';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class PdfService {

    public anchoPapel = 210;
    public altoPapel = 297;

    constructor() {}

    exportPdf(fileName: string, headers: any, data: any, order: boolean = true, size: number = 1) {
        const doc = this.generatePdf(fileName, headers, data, order, size);
        doc.save(fileName + '_export_' + new Date().getTime() + PDF_EXTENSION);
    }

    generatePdfArchive(fileName: string, headers: any, data: any, order: boolean = true, size: number = 1) {
        const doc = this.generatePdf(fileName, headers, data, order, size);
        return doc.output('blob');
    }

    generatePdf(fileName: string, headers: any, data: any, order: boolean = true, size: number = 1) {
        let header: any;
        let body: any;
        if (order) {
            header = this.converArrayObjectToArray(headers);
            body = this.converArrayObjectToArray(data);
        } else {
            header = headers;
            body = data;
        }

        let pageFormat: any;
        switch (size) {
            case 1: pageFormat = [3000, 2000]; break;
            case 2: pageFormat = [4000, 3000]; break;
            case 3: pageFormat = [5000, 3000]; break;
            case 4: pageFormat = [6000, 3000]; break;
            case 5: pageFormat = [8000, 3000]; break;
            case 6: pageFormat = [10000, 3000]; break;
        }

        const doc = new PDF( 'l', 'mm', pageFormat);

        doc.setFontSize (8);
        doc.setFontStyle ('arial');
        doc.autoTable({
            // theme: 'plain',
            head: header,
            body: body,
            startY: 15,
            tableWidth: 'auto',
            /* apply styling to table body */
            bodyStyles: {
                valign: 'top'
            },
            /* apply global styling */
            styles: { cellPadding: 0.5, fontSize: 8 },
            /* apply styling specific to table columns */
            columnStyles: {
                text: {
                    cellWidth: 'auto'
                }
            }
        });
        return doc;
    }

    converArrayObjectToArray(obeject: any) {
        const array = [];
        for (let i = 0; i < obeject.length; i++) {
            const arrayInterno = [];
            // tslint:disable-next-line: forin
            for (const label in obeject[i]) {
                arrayInterno.push(obeject[i][label]);
            }
            array.push(arrayInterno);
        }
        return array;
    }

}
