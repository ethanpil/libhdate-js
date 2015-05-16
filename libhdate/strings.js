/*  libhdate - Hebrew calendar library
 *
 *  Copyright (C) 2015 Yaacov Zamir <kobi.zamir@gmail.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 Return string of hebrew parasha.

 @param reading string number
 @returns the name of parasha 1. Bereshit etc..
 (55 trow 61 are joined strings e.g. Vayakhel Pekudei)
*/
function hdate_get_parasha_name(reading) {
    var strings = [
        "none", "בראשית", "נח",
        "לך לך", "וירא", "חיי שרה",
        "תולדות", "ויצא", "וישלח",
        "וישב", "מקץ", "ויגש",
        "ויחי", "שמות", "וארא",
        "בא", "בשלח", "יתרו",
        "משפטים", "תרומה", "תצוה",
        "כי תשא", "ויקהל", "פקודי",
        "ויקרא", "צו", "שמיני",
        "תזריע", "מצורע", "אחרי מות",
        "קדושים", "אמור", "בהר",
        "בחוקתי", "במדבר", "נשא",
        "בהעלתך", "שלח", "קרח",
        "חקת", "בלק", "פנחס",
        "מטות", "מסעי", "דברים",
        "ואתחנן", "עקב", "ראה",
        "שופטים", "כי תצא", "כי תבוא",
        "נצבים", "וילך", "האזינו",
        "וזאת הברכה",
        "ויקהל-פקודי", "תזריע-מצורע", "אחרי מות-קדושים",
        "בהר-בחוקתי", "חוקת-בלק", "מטות מסעי",
        "נצבים-וילך"];
    return strings[reading];
}
exports.hdate_get_parasha_name = hdate_get_parasha_name;
/**
 Return string of hebrew holydays.

 @param holyday string number
 @returns the name of holyday
*/
function hdate_get_holyday_name(holyday) {
    var strings = ["none",
        "א ר\"ה", "ב' ר\"ה",
        "צום גדליה", "יוה\"כ",
        "סוכות", "חוה\"מ סוכות",
        "הוש\"ר", "שמח\"ת",
        "חנוכה", "י' בטבת",
        "ט\"ו בשבט", "תענית אסתר",
        "פורים", "שושן פורים",
        "פסח", "חוה\"מ פסח",
        "יום העצמאות", "ל\"ג בעומר",
        "ערב שבועות", "שבועות",
        "צום תמוז", "ט' באב",
        "ט\"ו באב", "יום השואה",
        "יום הזכרון", "יום י-ם",
        "שמיני עצרת", "ז' פסח",
        "אחרון של פסח", "ב' שבועות",
        "ב' סוכות", "ב' פסח",
        "יום המשפחה", "יום זכרון...",
        "יום הזכרון ליצחק רבין", "יום ז\'בוטינסקי",
        "עיוה\"כ"];
    return strings[holyday];
}
exports.hdate_get_holyday_name = hdate_get_holyday_name;
