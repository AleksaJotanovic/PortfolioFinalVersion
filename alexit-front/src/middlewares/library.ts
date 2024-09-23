// export const sum = (array: any[], property: string) => {
//     let sum = 0;
//     array.forEach(e => sum += (e[property]));
//     return sum;
// }
// export const money = (number: number) => {
//     return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' RSD';
// };

// export const arePropertiesEmpty = (obj: any) => {
//     for (let prop in obj) {
//         if (typeof obj[prop] === 'string' && obj[prop].trim() === '') {
//             return true;
//         }
//     }
//     return false;
// }

// export const areObjectsEqual = (obj1: any, obj2: any) => {
//     const keys1 = Object.keys(obj1);
//     const keys2 = Object.keys(obj2);

//     if (keys1.length !== keys2.length) {
//         return false;
//     };
//     for (const key of keys1) {
//         if (obj1[key] !== obj2[key]) {
//             return false;
//         };
//     };
//     return true;
// };

// export const addCharAtIndex = (inputString: string, charToAdd: string, index: number) => {
//     if (index < 0 || index > inputString.length) {
//         throw new Error('Index out of bounds');
//     };
//     return inputString.slice(0, index) + charToAdd + inputString.slice(index);
// };

// export const subPercentage = (value: number, percentage: number) => {
//     const percentageOfValue = Math.round(Number(percentage / 100) * value);
//     return value - percentageOfValue;
// };





// // --------------------------------------------------------------------------------------------
// export const countVat = (price: any) => Math.round(Number(20 / 100) * Number(price));
// export const countSalePrice = (price: any) => {
//     const vat = Number(countVat(price));
//     return Math.round(Number(vat) + Number(price));
// };
// export const countEarning = (margin: any, price: any) => {
//     return Math.round(Number(price) * Number(String('0.' + margin)));
// };
// export const countRegularPrice = (margin: any, price: any) => {
//     const marginCf = Number('1.' + margin);
//     return Math.round(Number(price) * Number(marginCf));
// };
// export const groupByWeeks = (array: any[]) => {
//     let weeksArray: any[] = [];
//     let currentWeek: any[] = [];
//     array.forEach((obj) => {
//         currentWeek.push({ earned: obj.earned, date: new Date(obj.createdAt).toLocaleDateString() });
//         if (currentWeek.length === 7) {
//             weeksArray.push({ week: currentWeek, total: sum(currentWeek, 'earned') });
//             currentWeek = [];
//         };
//     });
//     return weeksArray;
// };
// export const groupByMonth = (array: any[]) => {
//     const groupedData: any[] = [];
//     array.forEach(item => {
//         const monthYear = `${new Date(item.createdAt).getFullYear()}-${(new Date(item.createdAt).getMonth() + 1)
//             .toString()
//             .padStart(2, '0')}`;
//         const existingGroup = groupedData.find(group => group.monthYear === monthYear);
//         if (existingGroup) {
//             existingGroup.month.push(item);
//             existingGroup.total = sum(existingGroup.month, 'earned');
//         } else {
//             groupedData.push({
//                 monthYear,
//                 month: [item],
//                 total: 0
//             });
//         }
//     });
//     return groupedData;
// };
// export const groupByYear = (array: any[]) => {
//     const groupedData: any[] = [];
//     array.forEach((obj) => {
//         const fullYear = new Date(obj.createdAt).getFullYear();
//         const yearIndex = groupedData.findIndex((group) => group.fullYear === fullYear);
//         if (yearIndex === -1) {
//             groupedData.push({ fullYear, year: [obj], total: 0 });
//         } else {
//             groupedData[yearIndex].year.push(obj);
//             groupedData[yearIndex].total = sum(groupedData[yearIndex].year, 'earned');
//         }
//     });
//     return groupedData;
// };