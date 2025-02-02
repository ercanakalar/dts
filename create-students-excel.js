const ExcelJS = require('exceljs');

async function createExcelFile() {
  // Create a new workbook and add a worksheet named "Students"
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Students');

  // Define the columns based on your Student model fields (excluding auto-handled fields)
  worksheet.columns = [
    { header: 'firstName', key: 'firstName', width: 15 },
    { header: 'lastName', key: 'lastName', width: 15 },
    { header: 'tc', key: 'tc', width: 15 },
    { header: 'address', key: 'address', width: 30 },
    { header: 'phoneNumber1', key: 'phoneNumber1', width: 15 },
    { header: 'phoneNumber2', key: 'phoneNumber2', width: 15 },
    { header: 'parentId', key: 'parentId', width: 10 },
    { header: 'institutionKey', key: 'institutionKey', width: 20 },
  ];

  // Add some sample data rows
  worksheet.addRow({
    firstName: 'John',
    lastName: 'Doe',
    tc: '12345678901',
    address: '123 Main St, Springfield',
    phoneNumber1: '555-1234',
    phoneNumber2: '555-5678',
    parentId: 1,
    institutionKey: 'INST-KEY-001',
  });

  worksheet.addRow({
    firstName: 'Jane',
    lastName: 'Smith',
    tc: '23456789012',
    address: '456 Oak St, Springfield',
    phoneNumber1: '555-2345',
    phoneNumber2: '555-6789',
    parentId: 2,
    institutionKey: 'INST-KEY-001',
  });

  worksheet.addRow({
    firstName: 'Alice',
    lastName: 'Johnson',
    tc: '34567890123',
    address: '789 Pine St, Springfield',
    phoneNumber1: '555-3456',
    phoneNumber2: '555-7890',
    parentId: 3,
    institutionKey: 'INST-KEY-001',
  });

  worksheet.addRow({
    firstName: 'Bob',
    lastName: 'Williams',
    tc: '45678901234',
    address: '101 Maple Ave, Springfield',
    phoneNumber1: '555-4567',
    phoneNumber2: '555-8901',
    parentId: 4,
    institutionKey: 'INST-KEY-001',
  });

  // Write the workbook to a file named "students.xlsx"
  await workbook.xlsx.writeFile('students.xlsx');
  console.log('Excel file "students.xlsx" has been created.');
}

createExcelFile().catch((error) => {
  console.error('Error creating Excel file:', error);
});
