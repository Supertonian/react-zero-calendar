import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
import { getLunar } from 'holiday-kr';
import datetime from '../utils/datetime';
import { Hidden } from '@material-ui/core';

const Calendar = observer(({ setTitle, calendarRef, locale, store }) => {
  useEffect(() => {
    setTitle(calendarRef.current.getApi().view.title);
  }, [calendarRef, setTitle]);

  function handleEventClick(clickInfo) {
  }

  function handleDateSelect(selectInfo) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  }

  function handleEventChange(changeInfo) {
    changeInfo.revert();
  }

  function renderEventContent(eventContent) {}

  function renderHeaderContent(content) {
    let { text } = content;
    const lunar = getLunar(content.date);
    const color = content.dow === 0 ? 'red' : 'black';

    if (content.view.type === 'dayGrid' || content.view.type === 'dayGridMonth') {
      return (
        <>
          <span style={{ color }}>{datetime.getDayName(content.dow, locale)}</span>
        </>
      );
    }

    if (content.view.type === 'timeGridWeek') {
      const dayStartIndex = text.indexOf('. ');
      text = text.slice(dayStartIndex + 2, text.length);
      const textSplitted = text.split('. ');
      text = `${textSplitted[0]} ${textSplitted[1]}`;
    } else if (content.view.type === 'timeGridDay') {
      text = text.slice(0, 1);
      text = `${content.view.getCurrentData().viewApi.currentStart.getDate()} (${text})`;
    }

    return (
      <>
        <span style={{ color }}>{text}</span>
        <Hidden xsDown>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            ({lunar.month}/{lunar.day})
          </span>
        </Hidden>
        <Hidden smUp>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            ({lunar.day})
          </span>
        </Hidden>
      </>
    );
  }

  function renderDayContent(content) {
    const lunar = getLunar(content.date);
    const color = content.dow === 0 ? 'red' : 'black';

    if (content.view.type === 'timeGridWeek' || content.view.type === 'timeGridDay') {
      return <></>;
    }
    return (
      <>
        <span style={{ color }}>{content.date.getDate()}</span>
        <Hidden xsDown>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            ({lunar.month}/{lunar.day})
          </span>
        </Hidden>
        <Hidden smUp>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            ({lunar.day})
          </span>
        </Hidden>
      </>
    );
  }

  function onUpdateDates() {
    if (calendarRef && calendarRef.current) {
      setTitle(calendarRef.current.getApi().view.title);
    }
  }

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        height="600px"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, luxonPlugin, rrulePlugin]}
        headerToolbar={false}
        locale={locale}
        initialView="dayGridMonth"
        nowIndicator
        titleFormat="yyyy년 {MM}월"
        buttonIcons
        firstDay={0}
        navLinks
        editable
        selectable
        selectMirror
        dayMaxEvents
        dayMaxEventRows={6}
        slotDuration="00:30:00"
        slotLabelInterval="01:00"
        events={store.events.slice()}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        fixedWeekCount={false}
        datesSet={onUpdateDates}
        allDayText="종일"
        moreLinkText=""
        dayHeaderContent={renderHeaderContent}
        dayCellContent={renderDayContent}
        allDayMaintainDuration
      />
    </>
  );
});

export default Calendar;
