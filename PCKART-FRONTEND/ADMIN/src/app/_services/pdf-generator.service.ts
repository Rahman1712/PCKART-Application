import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import * as jsPDF from 'jspdf';

// declare var jsPDF: any;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generatePDFWithTable(data: any[], headers: string[], filename: string) {
    const doc = new jsPDF();

    // Company Logo (left)
    const imgWidth = 50; 
    const imgHeight = 30;
    doc.addImage('/assets/img/pckart.jpg', 'JPG', 10, 10, imgWidth, imgHeight);

    // Company Details (center)
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold'); 
    doc.setTextColor(0, 0, 139); 
    doc.text('PCKART', 70, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0);
    doc.text("DubaiMall Calicut", 70, 30);
    doc.text("7356341940", 70, 40);

    doc.setFont('helvetica', 'normal'); // Reset font style
    // Date (right)
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    doc.text(formattedDate, 170, 20);

    // Divider
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);

    doc.text('Orders', 10, 60);
    const tableY = 70; 
    const tableData = data.map(row => headers.map(header => row[header]));
    autoTable(doc, {
      startY: tableY,
      head: [headers],
      body:tableData,
    })

    doc.save(filename + '.pdf');
  }
}
