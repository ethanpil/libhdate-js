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

export class Hdate {
  /** The number of day in the hebrew month (1..31). */
  public hd_day:number = 0;
  /** The number of the hebrew month 1..14 (1 - tishre, 13 - adar 1, 14 - adar 2). */
  public hd_mon:number = 0;
  /** The number of the hebrew year. */
  public hd_year:number = 0;
  /** The number of the day in the month. (1..31) */
  public gd_day:number = 0;
  /** The number of the month 1..12 (1 - jan). */
  public gd_mon:number = 0;
  /** The number of the year. */
  public gd_year:number = 0;
  /** The day of the week 1..7 (1 - sunday). */
  public hd_dw:number = 0;
  /** The length of the year in days. */
  public hd_size_of_year:number = 0;
  /** The week day of Hebrew new year. */
  public hd_new_year_dw:number = 0;
  /** The number type of year. */
  public hd_year_type:number = 0;
  /** The Julian day number */
  public hd_jd:number = 0;
  /** The number of days passed since 1 tishrey */
  public hd_days:number = 0;
  /** The number of weeks passed since 1 tishrey */
  public hd_weeks:number = 0;
  
  /**
   Days since bet (?) Tishrey 3744
   
   Amos Shapir 1984 (rev. 1985, 1992) Yaacov Zamir 2015 
   
   @param hebrew_year The Hebrew year
   @returns number of days since 3,1,3744
  */
  private 
  hdate_days_from_3744 (hebrew_year:number):number
  {
    /** constants */
    const HOUR = 1080;
    const DAY = 24*HOUR;
    const WEEK = 7*DAY;
    const MONTH = DAY+HOUR*12+793;  /* Tikun for regular month */
    
    var years_from_3744:number = 0;
    var molad_3744:number = 0;
    var leap_months:number = 0;
    var leap_left:number = 0;
    var months:number = 0;
    var parts:number = 0;
    var days:number = 0;
    var parts_left_in_week:number = 0;
    var parts_left_in_day:number = 0;
    var week_day:number = 0;

    /* Start point for calculation is Molad new year 3744 (16BC) */
    years_from_3744 = hebrew_year - 3744;
    molad_3744 = (1 + 6)*HOUR+779;  /* Molad 3744 + 6 hours in parts */

    /* Time in months */
    leap_months = Math.floor((years_from_3744 * 7 + 1) / 19);  /* number of leap months */
    leap_left = (years_from_3744 * 7 + 1) % 19;  /* Months left of leap cycle */
    months = years_from_3744 * 12 + leap_months;  /* Total number of months */

    /* Time in parts and days */
    parts = months * MONTH + molad_3744;  /* Molad This year + Molad 3744 - corections */
    days = months * 28 + Math.floor(parts / DAY) - 2;  /* 28 days in month + corections */

    /* Time left for round date in corections */
    parts_left_in_week = parts % WEEK;  /* 28 % 7 = 0 so only corections counts */
    parts_left_in_day = parts % DAY;
    week_day = Math.floor(parts_left_in_week / DAY);

    /* Special cases of Molad Zaken */
    if ((leap_left < 12 && week_day == 3
         && parts_left_in_day >= (9 + 6)*HOUR+204) ||
        (leap_left < 7 && week_day == 2
         && parts_left_in_day >= (15 + 6)*HOUR+589))
    {
      days++; week_day++;
    }

    /* ADU */
    if (week_day == 1 || week_day == 4 || week_day == 6)
    {
      days++;
    }

    return days;
  }

  /**
   Size of Hebrew year in days
   
   @param hebrew_year The Hebrew year
   @returns Size of Hebrew year
  */
  private
  hdate_get_size_of_hebrew_year (hebrew_year:number):number
  {
    return this.hdate_days_from_3744 (hebrew_year + 1) -
      this.hdate_days_from_3744 (hebrew_year);
  }

  /**
   Return Hebrew year type based on size and first week day of year.
   
   year type | year length | Tishery 1 day of week
   | 1       | 353         | 2 
   | 2       | 353         | 7 
   | 3       | 354         | 3 
   | 4       | 354         | 5 
   | 5       | 355         | 2 
   | 6       | 355         | 5 
   | 7       | 355         | 7 
   | 8       | 383         | 2 
   | 9       | 383         | 5 
   |10       | 383         | 7 
   |11       | 384         | 3 
   |12       | 385         | 2 
   |13       | 385         | 5 
   |14       | 385         | 7 
   
   @param size_of_year Length of year in days
   @param new_year_dw First week day of year
   @returns A number for year type (1..14)
  */
  private
  hdate_get_year_type (size_of_year:number, new_year_dw:number)
  {
    /* Only 14 combinations of size and week day are posible */
    var year_types:number[] =
      [1, 0, 0, 2, 0, 3, 4, 0, 5, 0, 6, 7,
      8, 0, 9, 10, 0, 11, 0, 0, 12, 0, 13, 14];
    
    var offset:number = 0;
    
    /* convert size and first day to 1..24 number */
    /* 2,3,5,7 . 1,2,3,4 */
    /* 353, 354, 355, 383, 384, 385 . 0, 1, 2, 3, 4, 5 */
    offset = Math.floor((new_year_dw + 1) / 2);
    offset = offset + 4 * ((size_of_year % 10 - 3) + Math.floor(size_of_year / 10 - 35));
    
    /* some combinations are imposible */
    return year_types[offset - 1];
  }

  /**
   Compute Julian day from Gregorian day, month and year
   Algorithm from the wikipedia's julian_day 

   Yaacov Zamir

   @param day Day of month 1..31
   @param month Month 1..12
   @param year Year in 4 digits e.g. 2001
   @returns The julian day number
   */
  private
  hdate_gdate_to_jd (day:number, month:number, year:number):number
  {
    var a:number = 0;
    var y:number = 0;
    var m:number = 0;
    var jdn:number = 0;
    
    a = Math.floor((14 - month) / 12);
    y = year + 4800 - a;
    m = month + 12 * a - 3;
    
    jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    return jdn;
  }

  /**
   Compute Julian day from Hebrew day, month and year
   
   Amos Shapir 1984 (rev. 1985, 1992) Yaacov Zamir 2003-2005

   @param day Day of month 1..31
   @param month Month 1..14 (13 - Adar 1, 14 - Adar 2)
   @param year Hebrew year in 4 digits e.g. 5753
   @returns The julian day number
   */
  private
  hdate_hdate_to_jd (day:number, month:number, year:number):number
  {
    var length_of_year:number = 0;
    var jd:number = 0;
    var days_from_3744:number = 0;

    /* Adjust for leap year */
    if (month == 13)
    {
      month = 6;
    }
    if (month == 14)
    {
      month = 6;
      day += 30;
    }

    /* Calculate days since 1,1,3744 */
    days_from_3744 = this.hdate_days_from_3744 (year);
    day = days_from_3744 + Math.floor((59 * (month - 1) + 1) / 2) + day;

    /* length of year */
    length_of_year = this.hdate_days_from_3744 (year + 1) - days_from_3744;
  
    /* Special cases for this year */
    if (length_of_year % 10 > 4 && month > 2)  /* long Heshvan */
      day++;
    if (length_of_year % 10 < 4 && month > 3)  /* short Kislev */
      day--;
    if (length_of_year > 365 && month > 6)  /* leap year */
      day += 30;

    /* adjust to julian */
    jd = day + 1715118;
  
    return jd;
  }

  /**
   Converting from the Julian day to the Gregorian day
   Algorithm from 'Julian and Gregorian Day numbers' by Peter Meyer 

   Yaacov Zamir ( Algorithm, Henry F. Fliegel and Thomas C. Van Flandern ,1968)

   @param jd Julian day
   @returns date as d,m,y array
     d Return Day of month 1..31
     m Return Month 1..12
     y Return Year in 4 digits e.g. 2001
   */
  private
  hdate_jd_to_gdate (jd:number):number[]
  {
    var l:number, n:number, l:number, i:number, j:number, d:number, m:number, y:number;
    
    l = jd + 68569;
    n = Math.floor((4 * l) / 146097);
    l = l - Math.floor((146097 * n + 3) / 4);
    i = Math.floor((4000 * (l + 1)) / 1461001);  /* that's 1,461,001 */
    l = l - Math.floor((1461 * i) / 4) + 31;
    j = Math.floor((80 * l) / 2447);
    d = l - Math.floor((2447 * j) / 80);
    l = Math.floor(j / 11);
    m = j + 2 - (12 * l);
    y = 100 * (n - 49) + i + l;  /* that's a lower-case L */

    return [d, m, y];
  }

  /**
   Converting from the Julian day to the Hebrew day
   
   Amos Shapir 1984 (rev. 1985, 1992) Yaacov Zamir 2003-2008

   @param jd Julian day
   @returns date as d,m,y array
     d Return Day of month 1..31
     m Return Month 1..14 (13 - Adar 1, 14 - Adar 2)
     y Return Year in 4 digits e.g. 5761
   */
  private
  hdate_jd_to_hdate (jd:number):number[]
  {
    var days:number = 0;
    var size_of_year:number = 0;
    var jd_tishrey1:number = 0;
    var jd_tishrey1_next_year:number = 0;
    var day:number;
    var month:number;
    var year:number;
    
    /* calculate Gregorian date */
    [day, month, year] = this.hdate_jd_to_gdate (jd);

    /* Guess Hebrew year is Gregorian year + 3760 */
    year = year + 3760;

    jd_tishrey1 = this.hdate_days_from_3744 (year) + 1715119;
    jd_tishrey1_next_year = this.hdate_days_from_3744 (year + 1) + 1715119;
    
    /* Check if computed year was underestimated */
    if (jd_tishrey1_next_year <= jd)
    {
      year = year + 1;
      jd_tishrey1 = jd_tishrey1_next_year;
      jd_tishrey1_next_year = this.hdate_days_from_3744 (year + 1) + 1715119;
    }

    size_of_year = jd_tishrey1_next_year - jd_tishrey1;
    
    /* days into this year, first month 0..29 */
    days = jd - jd_tishrey1;
    
    /* last 8 months allways have 236 days */
    if (days >= (size_of_year - 236)) /* in last 8 months */
    {
      days = days - (size_of_year - 236);
      month = Math.floor(days * 2 / 59);
      day = days - Math.floor((month * 59 + 1) / 2) + 1;
      
      month = month + 4 + 1;
      
      /* if leap */
      if (size_of_year > 355 && month <=6)
        month = month + 8;
    }
    else /* in 4-5 first months */
    {
      /* Special cases for this year */
      if (size_of_year % 10 > 4 && days == 59) /* long Heshvan (day 30 of Heshvan) */
        {
          month = 1;
          day = 30;
        }
      else if (size_of_year % 10 > 4 && days > 59) /* long Heshvan */
        {
          month = Math.floor((days - 1) * 2 / 59);
          day = days - Math.floor((month * 59 + 1) / 2);
        }
      else if (size_of_year % 10 < 4 && days > 87) /* short kislev */
        {
          month = Math.floor((days + 1) * 2 / 59);
          day = days - Math.floor((month * 59 + 1) / 2) + 2;
        }
      else /* regular months */
        {
          month = Math.floor(days * 2 / 59);
          day = days - Math.floor((month * 59 + 1) / 2) + 1;
        }
        
      month = month + 1;
    }
    
    return [day, month, year, jd_tishrey1, jd_tishrey1_next_year];
  }

  /**
   compute date structure from the  Julian day number

   @param jd Julian day number
   */
  public
  set_jd (jd:number):void
  {
    var jd_tishrey1:number, jd_tishrey1_next_year:number;
    
    [this.gd_day, this.gd_mon, this.gd_year] = this.hdate_jd_to_gdate (jd);
    [this.hd_day, this.hd_mon, this.hd_year, jd_tishrey1, jd_tishrey1_next_year] = this.hdate_jd_to_hdate (jd);
    
    this.hd_dw = (jd + 1) % 7 + 1;
    this.hd_size_of_year = jd_tishrey1_next_year - jd_tishrey1;
    this.hd_new_year_dw = (jd_tishrey1 + 1) % 7 + 1;
    this.hd_year_type = this.hdate_get_year_type (this.hd_size_of_year , this.hd_new_year_dw);
    this.hd_jd = jd;
    this.hd_days = jd - jd_tishrey1 + 1;
    this.hd_weeks = Math.floor(((this.hd_days - 1) + (this.hd_new_year_dw - 1)) / 7) + 1;
    
    return;
  }
  
  /**
   compute date structure from the Gregorian date

   @param d Day of month 1..31
   @param m Month 1..12
   @param y Year in 4 digits e.g. 2001
   */
  public
  set_gdate (d:number, m:number, y:number):void
  {
    var jd:number;
    
    jd = this.hdate_gdate_to_jd (d, m, y);
    this.set_jd (jd);
  }
  
  /**
   compute date structure from the Hebrew date

   @param d Day of month 1..31
   @param m Month 1..14 (13 - Adar 1, 14 - Adar 2)
   @param y Year in 4 digits e.g. 5743
   */
  public
  set_hdate (d:number, m:number, y:number):void
  {
    var jd:number;
    
    jd = this.hdate_hdate_to_jd (d, m, y);
    this.set_jd (jd);
  }
}