var documenterSearchIndex = {"docs":
[{"location":"business_days/#Overview-1","page":"Business Days","title":"Overview","text":"","category":"section"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"Up to now we have dealt with date operations that do not take into consideration one of the key features, holidays. Whether its working around weekends or the UK's bank holidays, operations involving holidays (or equivalently business days) is essential.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"As such the RDate package provides the construct to allow you to work with holiday calendars, without tying you to a specific implementation.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"note: Note\nIt is currently not within the scope of RDates to build a calendar system, but I do envisage this as the next step as the essential components for it are provided.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"Before we walk through how this is integrated into the RDate language, we'll look at how calendars are modelled.","category":"page"},{"location":"business_days/#Calendars-1","page":"Business Days","title":"Calendars","text":"","category":"section"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"A calendar defines whether a given day is a holiday. To implement a calendar you need to inherit from RDates.Calendar and define the method is_holiday(x::Calendar, ::Dates.Date)::Bool.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"We provide basic calendar implementations to support addition and weekends.","category":"page"},{"location":"business_days/#Calendar-Manager-1","page":"Business Days","title":"Calendar Manager","text":"","category":"section"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"To access calendars within the relative date library, we use a calendar manager. It provides the interface to access calendars based on their name, a string identifier.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"We provide a basic implementation called SimpleCalendarManager that will wrap up basic calendars in a hashmap.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"julia> cals = Dict(\"WEEKEND\" => RDates.WeekendCalendar())\njulia> cal_mgr = RDates.SimpleCalendarManager(cals)\njulia> is_holiday(calendar(cal_mgr, [\"WEEKEND\"]), Date(2019,9,28))\ntrue","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"You can either pass the calendar manager as an optional argument to apply or use the with_cal_mgr do block","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"with_cal_mgr(cal_mgr) do\n  rd\"1b@WEEKEND\" + Date(2019,1,1)\nend","category":"page"},{"location":"business_days/#Calendar-Adjustments-1","page":"Business Days","title":"Calendar Adjustments","text":"","category":"section"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"Now that we have a way for checking whether a given day is a holiday and can use your calendar manager, let's introduce calendar adjustments.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"These allow us to apply a holiday calendar adjustment, after a base rdate has been applied. To support this we need to introduce the concept of Holiday Rounding.","category":"page"},{"location":"business_days/#Holiday-Rounding-Convention-1","page":"Business Days","title":"Holiday Rounding Convention","text":"","category":"section"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"The holiday rounding convention provides the details on what to do if we fall on a holiday.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"Next Business Day or NBD means to move forward to the next day that is not a holiday.\nPrevious Business Day or PBD means to move bacwards to the last day that was not a holiday.\nNext Business Day Same Month or NBDSM means to apply Next Business Day unless the day found is not in the same month as where we started, then instead apply Previous Business Day.\nPrevious Business Day Same Month or PBDSM means to apply Previous Business Day unless the day found is not in the same month as where we started, then instead apply Next Business Day.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"An adjustment is specified using the @ symbol, followed by a | delimited set of calendar names. The holiday rounding convention is then provided in its short form in square brackets afterwards.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"cals = Dict(\"WEEKEND\" => RDates.WeekendCalendar())\ncal_mgr = RDates.SimpleCalendarManager(cals)\nwith_cal_mgr(cal_mgr) do\n  rd\"1d\" + Date(2019,9,27) == Date(2019,9,28)\n  rd\"1d@WEEKEND[NBD]\" + Date(2019,9,27) == Date(2019,9,30)\n  rd\"2m - 1d\" + Date(2019,7,23) == Date(2019,9,22)\n  rd\"(2m - 1d)@WEEKEND[PBD]\" + Date(2019,7,23) == Date(2019,9,20)\nend","category":"page"},{"location":"business_days/#Business-Days-1","page":"Business Days","title":"Business Days","text":"","category":"section"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"It can also be handy to work in business days at times, rather than calendar days. A holiday rounding convention is automatically selected, with a non-negative increment implying Next Business Day and a negative increment implying Previous Business Day.","category":"page"},{"location":"business_days/#","page":"Business Days","title":"Business Days","text":"note: Note\nFor the zero increment operator 0b@CALENDAR we select Next Business Day. However it's negation with -0b@CALENDAR will switch to Previous Business Day.cals = Dict(\"WEEKEND\" => RDates.WeekendCalendar())\ncal_mgr = RDates.SimpleCalendarManager(cals)\nwith_cal_mgr(cal_mgr) do\n  rd\"0b@WEEKEND\" + Date(2019,9,28) == Date(2019,9,30)\n  rd\"-0b@WEEKEND\" + Date(2019,9,28) == Date(2019,9,27)\n  rd\"10b@WEEKEND\" + Date(2019,9,27) == Date(2019,10,11)    \nend","category":"page"},{"location":"primitives/#Primitives-1","page":"Primitives","title":"Primitives","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"RDates is designed to allow complex date operations to be completed using basic primitive types. Each of these primitive types and operations are explained in more detail in subsequent sections.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We now go through each of the primitive types, from which we can combine together using compounding operations.","category":"page"},{"location":"primitives/#Days-1","page":"Primitives","title":"Days","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Provides us with the ability to add or subtract days from a date. This is equivalent to the Dates.Day struct.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"3d\" + Date(2019,1,1)\n2019-01-04\njulia> RDates.Day(3) + Date(2019,1,1)\n2019-01-04\njulia> rd\"-2d\" + Date(2019,1,1)\n2018-12-30","category":"page"},{"location":"primitives/#Weeks-1","page":"Primitives","title":"Weeks","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Provides us with the ability to add or subtract weeks from a date. This is equivalent to the Dates.Week struct.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"3w\" + Date(2019,1,1)\n2019-01-22\njulia> RDates.Week(3) + Date(2019,1,1)\n2019-01-22\njulia> rd\"-2w\" + Date(2019,1,1)\n2018-12-18","category":"page"},{"location":"primitives/#Months-1","page":"Primitives","title":"Months","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Adding months to a date is a surprisingly complex operation. For example","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"What should happen if I add one month to the 31st January?\nShould adding one month to the 30th April maintain the end of month?","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"To allow us to have this level of flexibility, we need to introduce two new conventions","category":"page"},{"location":"primitives/#Invalid-Day-Convention-1","page":"Primitives","title":"Invalid Day Convention","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We define conventions to determine what to do if adding (or subtracting) the months leads us to an invalid day.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Last Day Of Month or LDOM means that you should fall back to the last day of the current month.\nFirst Day Of Next Month or FDONM means that you should move forward to the first day of the next month.\nNth Day Of Next Month or NDONM means that you should move forward into the next month the number of days past you have ended up past the last day of month. This is will only differ to FDONM if you fall in February.","category":"page"},{"location":"primitives/#Month-Increment-Convention-1","page":"Primitives","title":"Month Increment Convention","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We also need to understand what to do when you add a month. Most of the time you'll be just looking to maintain the same day, but it can also sometimes be preferable to maintain the last day of the month.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Preserve Day Of Month or PDOM means that we'll always make sure we land on the same day (though invalid day conventions may kick in).\nPreserve Day Of Month And End Of Month or PDOMEOM means that we'll preserve the day of the month, unless the base date falls on the end of the month, then we'll keep to the end of the month going forward (noting that this will be applied prior to invalid day conventions). This can also be provided a set of calendars, to allow it to work as the last business day of the month.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We can now combine these together to start working with month adjustments. These arguments are passed in square brackets, semi colon separated, after the m using their shortened naming conventions.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1m[LDOM;PDOM]\" + Date(2019,1,31)\n2019-02-28\njulia> rd\"1m[FDONM;PDOM]\" + Date(2019,1,31)\n2019-03-01\njulia> rd\"1m[NDONM;PDOM]\" + Date(2019,1,31)\n2019-03-03\njulia> rd\"1m[NDONM;PDOMEOM]\" + Date(2019,1,31)\n2019-02-28","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We also provide default values for the conventions, with Last Day Of Month for invalid days and Preserve Day Of Month for our monthly increment.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1m\" == rd\"1m[LDOM;PDOM]\"\ntrue","category":"page"},{"location":"primitives/#Years-1","page":"Primitives","title":"Years","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Adding years is generally simple, except when we have to deal with February and leap years. As such, we use the same conventions as for months.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1y[LDOM;PDOM]\" + Date(2019,2,28)\n2020-02-28\njulia> rd\"1y[LDOM;PDOMEOM]\" + Date(2019,2,28)\n2020-02-29\njulia> rd\"1y[LDOM;PDOM]\" + Date(2020,2,29)\n2021-02-28\njulia> rd\"1y[FDOM;PDOM]\" + Date(2020,2,29)\n2021-03-01","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Similar to months we also provide default values for the conventions, with Last Day Of Month for invalid days and Preserve Day Of Month for our monthly increment.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1y\" == rd\"1y[LDOM;PDOM]\"\ntrue","category":"page"},{"location":"primitives/#First-And-Last-Day's-Of-The-Month-1","page":"Primitives","title":"First And Last Day's Of The Month","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Some similar operators that let you get the first or the last day of month from the given date.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"FDOM\" + Date(2019,1,13)\n2019-01-01\njulia> rd\"LDOM\" + Date(2019,1,13)\n2019-01-31","category":"page"},{"location":"primitives/#Easter-1","page":"Primitives","title":"Easter","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"A date that is well known from hunting eggs and pictures of bunnies, it's a rather tricky calculation to perform. We provide a simple method to allow you to get the Easter for the given year (or appropriately incremented or decremented from the given year)","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"To get Easter for the given year we can use 0E, for next year's Easter it's 1E and for the Easter two years ago it would be -2E","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"note: Note\n0E will get the Easter of the current year, so it could be before or after the date you've provided.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"0E\" + Date(2019,1,1)\n2019-04-21\njulia> rd\"0E\" + Date(2019,8,1)\n2019-04-21\njulia> rd\"10E\" + Date(2019,8,1)\n2029-04-01","category":"page"},{"location":"primitives/#Day-Month-1","page":"Primitives","title":"Day Month","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We can have the ability to apply a specific day and month pair to the given year. This is provided using the standard 3 letter acronym for months","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"note: Note\n1MAR will get the 1st of March of the current year, so it could be before or after the date you've provided.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1MAR\" + Date(2019,1,1)\n2019-03-01\njulia> rd\"29OCT\" + Date(2020,12,1)\n2020-10-29","category":"page"},{"location":"primitives/#Day-Month-Year-1","page":"Primitives","title":"Day Month Year","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"We can have the ability to move to a specific date, irrespective of the given date. This is provided using the standard 3 letter acronym for months and the full year.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1MAR2020\" + Date(2019,1,1)\n2020-03-01\njulia> rd\"29OCT1993\" + Date(2020,12,1)\n1993-10-29","category":"page"},{"location":"primitives/#Weekdays-1","page":"Primitives","title":"Weekdays","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"It's quite common to want to ask for what is the next Saturday or the last Tuesday. This provides a mechanism for querying based on that.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"For the grammar, the weekdays are given by their 3 letter acronym.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"The count associated tells us what we're looking for. 1MON will ask for the next Monday, exclusive of today. You can make it inclusive by adding ! to 1MON!. All other counts will then be additional weeks (forward or back) from this point.","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1WED\" + Date(2019,9,24) # A Tuesday\n2019-09-25\njulia> rd\"1WED\" + Date(2019,9,25)\n2019-10-02\njulia> rd\"1WED!\" + Date(2019,9,25)\n2019-09-25\njulia> rd\"0WED\" + Date(2019,9,26)\n2019-10-02","category":"page"},{"location":"primitives/#Nth-Weekday-1","page":"Primitives","title":"Nth Weekday","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"There are cases when you need to get a weekday in a given month, such as the 3rd Wednesday for IMM Dates. This can be achieved with the Nth Weekday (using the 3 letter acronym for the weekdays)","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"1st MON\" + Date(2019,9,24)\n2019-09-02\njulia> rd\"3rd WED\" + Date(2019,12,1)\n2019-12-18","category":"page"},{"location":"primitives/#Nth-Last-Weekday-1","page":"Primitives","title":"Nth Last Weekday","text":"","category":"section"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"Similarly you can work backwards if required","category":"page"},{"location":"primitives/#","page":"Primitives","title":"Primitives","text":"julia> rd\"Last MON\" + Date(2019,9,24)\n2019-09-30\njulia> rd\"3rd Last WED\" + Date(2019,12,1)\n2019-12-11","category":"page"},{"location":"#Introduction-1","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"#","page":"Introduction","title":"Introduction","text":"A relative date library for Julia","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"This is a project that builds around the Dates module to allow complex date operations.  ","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"The aim is to provide a standard toolset to allow you to answer questions such as when is the next Easter or what are the next 4 IMM dates from today?","category":"page"},{"location":"#Package-Features-1","page":"Introduction","title":"Package Features","text":"","category":"section"},{"location":"#","page":"Introduction","title":"Introduction","text":"A generic, extendable algebra for date operations with a rich set of primitives.\nA composable design to allow complex combinations of relative date operations.\nAn extendable parsing library to provide a language to describe relative dates.\nAn interface for integrating holiday calendar systems.","category":"page"},{"location":"#Installation-1","page":"Introduction","title":"Installation","text":"","category":"section"},{"location":"#","page":"Introduction","title":"Introduction","text":"RDates can be installed using the Julia package manager. From the Julia REPL, type ] to enter the Pkg REPL mode and run","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"pkg> add RDates","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"At this point you can now start using RDates in your current Julia session using the following command","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"julia> using RDates","category":"page"},{"location":"combinations/#Combinations-1","page":"Combinations","title":"Combinations","text":"","category":"section"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"One of the key features of RDates is to allow us to combine primitive operations to provide a generalised method to describe date adjustments.","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"We now provide details on the different forms of combinators that can be used within the package.","category":"page"},{"location":"combinations/#Negation-1","page":"Combinations","title":"Negation","text":"","category":"section"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"Where applicable, the primitive operations support negation. This can be achieved by applying the - operator on the RDate.","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"julia> Date(2019,1,1) - rd\"1d\"\n2018-12-31\njulia> -rd\"3w\" + Date(2019,1,1)\n2018-12-11","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"warning: Warning\nNot all RDates support negation. For example 1st WED does not have a reasonable inversion.julia> -rd\"1st WED\"\nERROR: RDates.NthWeekdays does not support negation","category":"page"},{"location":"combinations/#Addition-1","page":"Combinations","title":"Addition","text":"","category":"section"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"All RDates can be combined together via addition. The components are applied from left to right.","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"julia> rd\"1d + 1y\" + Date(2019,1,1)\n2020-01-02\njulia> rd\"1MAR + 3rd WED\" + Date(2019,1,1)\n2019-03-20","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"note: Note\nWhere possible, addition operations may be optimised to reduce down to simpler state.julia> rd\"1d + 1d\" == rd\"2d\"\ntrue","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"warning: Warning\nThe alegbra of month addition is not always straight forward. Make sure you're clear on exactly what you want to achieve.julia> rd\"2m\" + Date(2019,1,31)\n2019-03-31\njulia> rd\"1m + 1m\" + Date(2019,1,31)\n2019-03-28","category":"page"},{"location":"combinations/#Repeats-1","page":"Combinations","title":"Repeats","text":"","category":"section"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"You can multiply any RDate by a positive integer to repeat its application, or rolling it, that many times.","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"julia> rd\"2*roll(1m)\" + Date(2019,1,31)\n2019-03-28\njulia> rd\"-5*roll(3d + 4w)\" + Date(2019,1,1)\n2018-07-30","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"It's worth noting that we also support non rolled multiplication, which will attempt to embed the multiplication within the rdate.","category":"page"},{"location":"combinations/#","page":"Combinations","title":"Combinations","text":"julia> rd\"2*1m\" + Date(2019,1,31)\n2019-03-31\njulia> rd\"2*1m\" == rd\"2m\"\ntrue","category":"page"},{"location":"ranges/#Ranges-1","page":"Ranges","title":"Ranges","text":"","category":"section"},{"location":"ranges/#","page":"Ranges","title":"Ranges","text":"As well as performing relative date operations, you can also get a range of dates for a given period. This can provide an infinite range, or appropriate clipped.","category":"page"},{"location":"ranges/#","page":"Ranges","title":"Ranges","text":"julia> collect(Iterators.take(range(Date(2017,1,25), rd\"1d\"),3))\n3-element Array{Date,1}:\n 2017-01-25\n 2017-01-26\n 2017-01-27\njulia> collect(range(Date(2019,4,17), Date(2019,4,21), rd\"2d\"))\n3-element Array{Date,1}:\n 2019-04-17\n 2019-04-19\n 2019-04-21\njulia> collect(range(Date(2019,4,17), Date(2019,4,21), rd\"1d\", inc_from=false, inc_to=false))\n3-element Array{Date,1}:\n 2019-04-18\n 2019-04-19\n 2019-04-20","category":"page"},{"location":"ranges/#","page":"Ranges","title":"Ranges","text":"It should be noted that the range under the hood applies multiplynoroll for incremental counts to the  period, so by using RDates.Date we can provide a reference point that is isolated from the start date of the range.","category":"page"},{"location":"ranges/#","page":"Ranges","title":"Ranges","text":"This gives us the basic building blocks to also come up with complex functionality. For example, to get the next 4 future IMM Dates we can do the following","category":"page"},{"location":"ranges/#","page":"Ranges","title":"Ranges","text":"julia> today = Date(2017,10,27)\njulia> immdates = Iterators.take(Iterators.filter(x -> x >= today, range(today, RDates.Date(today) + rd\"1MAR+3m+3rd WED\")), 4)\njulia> collect(immdates)\n4-element Array{Date,1}:\n 2017-12-20\n 2018-03-21\n 2018-06-20\n 2018-09-19","category":"page"},{"location":"ranges/#","page":"Ranges","title":"Ranges","text":"note: Note\nWhile this works as expected, it will always be more efficient to reduce the rdate calculations being applied within the iterator. As such, calculating the 1st of March as a date first would save some unnecessary computations.","category":"page"}]
}
