import { TicketModel, TicketStatus } from '../entities/TicketModel'

export function canTransition(ticket: TicketModel, toStatus: TicketStatus) {
  switch (toStatus) {
    case TicketStatus.open: {
      return true
    }
    case TicketStatus.analysis: {
      return ticket.progress.analysis.getPercentage() < 100
    }
    case TicketStatus.development: {
      return ticket.progress.analysis.getPercentage() >= 50
    }
    case TicketStatus.testing: {
      return ticket.progress.development.getPercentage() >= 75
    }
    case TicketStatus.released: {
      return ticket.progress.development.getPercentage() >= 75
    }
  }
}
