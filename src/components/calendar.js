import React, { useEffect, useRef } from 'react';
import { useObserver } from 'mobx-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
// import { getLunar } from "holiday-kr";

const Calendar = ({ sidebarOpened }) => {
  const ref = useRef('ref');
  useEffect(() => {
    ref.current.getApi().updateSize();
  }, [sidebarOpened]);
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

  function onUpdateDates(dateInfo) {}

  return useObserver(() => (
    <>
      <FullCalendar
        ref={ref}
        height="auto"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          luxonPlugin,
          rrulePlugin,
        ]}
        headerToolbar={{
          start: 'prev,next',
          center: 'title',
          end: 'today dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale="ko"
        initialView="dayGridMonth"
        buttonText={{
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
          list: '목록',
        }}
        nowIndicator
        titleFormat="yyyy.{MM}"
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
        fixedWeekCount={true}
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
