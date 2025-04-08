const ExcelJS = require('exceljs');

async function createExcelFile() {
  // Create a new workbook and add a worksheet named "Students"
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Parent');

  // Define the columns based on your Student model fields (excluding auto-handled fields)
  worksheet.columns = [
    { header: 'firstName', key: 'firstName', width: 15 },
    { header: 'lastName', key: 'lastName', width: 15 },
    { header: 'tc', key: 'tc', width: 15 },
    { header: 'address', key: 'address', width: 30 },
    { header: 'phoneNumber1', key: 'phoneNumber1', width: 15 },
    { header: 'phoneNumber2', key: 'phoneNumber2', width: 15 },
    { header: 'studentTc', key: 'studentTc', width: 10 },
    { header: 'institutionKey', key: 'institutionKey', width: 20 },
  ];

  // Add some sample data rows
  worksheet.addRow({
    firstName: 'John1',
    lastName: 'Doe1',
    tc: '1-2345678901',
    address: '1-123 Main St, Springfield',
    phoneNumber1: '1-555-1234',
    phoneNumber2: '1-555-5678',
    studentTc: ['12345678901'],
    institutionKey: 'INST-KEY-001',
  });

  worksheet.addRow({
    firstName: 'Jane2',
    lastName: 'Smith2',
    tc: '2-23456789012',
    address: '2-456 Oak St, Springfield',
    phoneNumber1: '2-555-2345',
    phoneNumber2: '2-555-6789',
    studentTc: ['23456789012'],
    institutionKey: 'INST-KEY-001',
  });

  worksheet.addRow({
    firstName: 'Alice3',
    lastName: 'Johnson3',
    tc: '3-34567890123',
    address: '3-789 Pine St, Springfield',
    phoneNumber1: '3-555-3456',
    phoneNumber2: '3-555-7890',
    studentTc: ['34567890123'],
    institutionKey: 'INST-KEY-001',
  });

  worksheet.addRow({
    firstName: 'Bob4',
    lastName: 'Williams4',
    tc: '4-45678901234',
    address: '4101 Maple Ave, Springfield',
    phoneNumber1: '4-555-4567',
    phoneNumber2: '4-555-8901',
    studentTc: ['45678901234'],
    institutionKey: 'INST-KEY-001',
  });

  // Write the workbook to a file named "students.xlsx"
  await workbook.xlsx.writeFile('parent.xlsx');
  console.log('Excel file "parent.xlsx" has been created.');
}

createExcelFile().catch((error) => {
  console.error('Error creating Excel file:', error);
});
