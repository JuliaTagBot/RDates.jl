using Dates
using Compat

@compat abstract type RDate end
apply(rdate::RDate, date::Date) = error("$(typeof(rdate)) does not support 'apply'")
apply(date::Date, rdate::RDate) = apply(rdate, date)
negate(rdate::RDate) = error("$(typeof(rdate)) does not support 'negate'")

struct RDateDay <: RDate
    days::Int64
end

apply(rdate::RDateDay, date::Date) = date + Day(rdate.days)
negate(rdate::RDateDay) = RDateDay(-rdate.days)

struct RDateWeek <: RDate
    weeks::Int64
end

apply(rdate::RDateWeek, date::Date) = date + Week(rdate.weeks)
negate(rdate::RDateWeek) = RDateWeek(-rdate.weeks)

struct RDateMonth <: RDate
    months::Int64
end

apply(rdate::RDateMonth, date::Date) = date + Month(rdate.months)
negate(rdate::RDateMonth) = RDateMonth(-rdate.months)

struct RDateYear <: RDate
    years::Int64
end

apply(rdate::RDateYear, date::Date) = date + Year(rdate.years)
negate(rdate::RDateYear) = RDateYear(-rdate.years)

struct RDateFDOM <: RDate end
apply(rdate::RDateFDOM, date::Date) = firstdayofmonth(date)

struct RDateLDOM <: RDate end
apply(rdate::RDateLDOM, date::Date) = lastdayofmonth(date)

struct RDateDayMonth <: RDate
    day::Int64
    month::Int64
end

apply(rdate::RDateDayMonth, date::Date) = Date(year(date), rdate.month, rdate.day)

struct RDateEaster <: RDate
    yearδ::Int64
end
function apply(rdate::RDateEaster, date::Date)
    y = year(date) + rdate.yearδ
    a = rem(y, 19)
    b = div(y, 100)
    c = rem(y, 100)
    d = div(b, 4)
    e = rem(b, 4)
    f = div(b + 8, 25)
    g = div(b - f + 1, 3)
    h = rem(19*a + b - d - g + 15, 30)
    i = div(c, 4)
    k = rem(c, 4)
    l = rem(32 + 2*e + 2*i - h - k, 7)
    m = div(a + 11*h + 22*l, 451)
    n = div(h + l - 7*m + 114, 31)
    p = rem(h + l - 7*m + 114, 31)
    return Date(y, n, p + 1)
end

negate(rdate::RDateEaster) = RDateEaster(-rdate.yearδ)

struct RDateWeekdays <: RDate
    dayofweek::Int64
    count::Int64
end

function apply(rdate::RDateWeekdays, date::Date)
    dayδ = dayofweek(date) - rdate.dayofweek
    weekδ = rdate.count

    if rdate.count < 0 && dayδ > 0
        weekδ += 1
        weekδ -= 1
    elseif rdate.count > 0 && dayδ < 0
    end

    return date + Day(weekδ*7 + dayδ)
end

negate(rdate::RDateWeekdays) = RDateWeekdays(rdate.dayofweek, -rdate.count)

struct RDateCompound <: RDate
    parts::Vector{RDate}
end

apply(rdate::RDateCompound, date::Date) = Base.foldl(apply, rdate.parts, init=date)
combine(left::RDate, right::RDate) = RDateCompound([left,right])

struct RDateRepeat <: RDate
    count::Int64
    part::RDate
end

apply(rdate::RDateRepeat, date::Date) = Base.foldl(apply, fill(rdate.part, rdate.count), init=date)
negate(rdate::RDateRepeat) = RDateRepeat(rdate.count, negate(rdate.part))

Base.:+(rdate::RDate, date::Date) = apply(rdate, date)
Base.:+(left::RDate, right::RDate) = combine(left, right)
Base.:-(left::RDate, right::RDate) = combine(left, negate(right))
Base.:+(date::Date, rdate::RDate) = apply(rdate, date)
Base.:-(date::Date, rdate::RDate) = apply(negate(rdate), date)
Base.:*(count::Number, rdate::RDate) = RDateRepeat(count, rdate)
Base.:*(rdate::RDate, count::Number) = RDateRepeat(count, rdate)

struct RDateRange
    from::Date
    to::Union{Date, Nothing}
    period::RDate
    inc_from::Bool
    inc_to::Bool

    RDateRange(from::Date, period::RDate) = new(from, Nothing, period, true, true)
    RDateRange(from::Date, to::Date, period::RDate) = new(from, to, period, true, true)
end

function Base.iterate(iter::RDateRange, state=nothing)
    if state === nothing
        state = (iter.inc_from ? iter.from : iter.from + iter.period, 0)
    end
    elem, count = state
    if elem > iter.to
        return nothing
    end

    return (elem, (elem + iter.period, count + 1))
end

Base.range(from::Date, period::RDate) = RDateRange(from, period)
Base.range(from::Date, to::Date, period::RDate) = RDateRange(from, to, period)