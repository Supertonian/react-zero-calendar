import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
// import { getLunar } from "holiday-kr";

const Calendar = ({ setTitle, calendarRef }) => {
  useEffect(() => {
    setTitle(calendarRef.current.getApi().view.title);
  }, [calendarRef, setTitle]);

  function handleEventClick(clickInfo) {}

  function handleDateSelect(selectInfo) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  }

  function handleEventChange(changeInfo) {
    changeInfo.revert();
  }

  function renderEventContent(eventContent) {}

  function renderHeaderContent(content) {}

  function renderDayContent(content) {}

  function onUpdateDates() {
    if (calendarRef && calendarRef.current) {
      setTitle(calendarRef.current.getApi().view.title);
    }
  }

  return useObserver(() => (
    <>
      <FullCalendar
        ref={calendarRef}
        height="600px"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, luxonPlugin, rrulePlugin]}
        headerToolbar={false}
        locale="ko"
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
        events={[
          {
            title: 'HELLO',
            start: '2020-10-01 00:00:00',
            end: '2020-10-03 15:00:00',
          },
        ]}
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
  ));
};

export default Calendar;
