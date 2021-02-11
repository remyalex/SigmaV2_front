import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { BehaviorSubject } from 'rxjs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  protected _jsonDataExcel = null;
  protected _jsonDataExcelSubject = new BehaviorSubject<any>(this._jsonDataExcel);
  public jsonDataExcel$ = this._jsonDataExcelSubject.asObservable();

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  dataExportparent: any = [];

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsExcelFileCustom(json: any[], excelFileName: string, skipHeader, order): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {skipHeader: skipHeader, header: order});
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsExcelFileParent(data: any[], hojas: any[], nombrehojas: any[], excelFileName: string, skipHeader, headerData, headerHojas, orderData, orderHojas): void{
    var  worksheet: XLSX.WorkSheet;
    var workbook = {SheetNames:[], Sheets:{}};
    var hoja = '';
    
    //hoja principal
    this.dataExportparent = [...headerData, ...data];
    workbook.SheetNames.push("data");
    worksheet = XLSX.utils.json_to_sheet(this.dataExportparent, {skipHeader: skipHeader, header: orderData});
    workbook.Sheets["data"] = worksheet;

    //hojas
    for (let i = 0; i < nombrehojas.length; i++)
    {
      hoja = nombrehojas[i];
      this.dataExportparent = [...headerHojas, ...hojas[i]];
      workbook.SheetNames.push(hoja);
      worksheet = XLSX.utils.json_to_sheet(this.dataExportparent, {skipHeader: skipHeader, header: orderHojas});
      workbook.Sheets[hoja] = worksheet;
    }
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportAsExcelFileHojas(hojas: any[], nombrehojas: any[], excelFileName: string, skipHeader,
                                headerHojas: any[], orderHojas: any[]): void {
    let worksheet: XLSX.WorkSheet;
    const workbook = {SheetNames: [], Sheets: {}};
    let hoja = '';
    let existsData = false;

    // hojas
    for (let i = 0; i < nombrehojas.length; i++) {
      hoja = nombrehojas[i];
      this.dataExportparent = [];
      const headerHojasConcat = headerHojas[i];
      const headersHojasJson = {};
      const hojasConcat = hojas[hoja]['attributes'];
      if (hojasConcat) {
        for (let k = 0; k < headerHojasConcat.length; k++) {
          headersHojasJson[headerHojasConcat[k]] = headerHojasConcat[k];
        }
        this.dataExportparent.push(headersHojasJson);
        hojasConcat.map(dataHojas => {
          this.dataExportparent.push(dataHojas);
        });
        console.log('entro');
        existsData = true;
        workbook.SheetNames.push(hoja);
        worksheet = XLSX.utils.json_to_sheet(this.dataExportparent, {skipHeader: skipHeader, header: headerHojas[i]});
        workbook.Sheets[hoja] = worksheet;
      }
    }
    if (existsData === true) {
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
  }

  excelToJson(event: any){
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (ev) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return initial;
      }, {});
      this._jsonDataExcel = jsonData;
      this._jsonDataExcelSubject.next(this._jsonDataExcel);
    };
    reader.readAsBinaryString(file);
  }
}