import {Component, OnInit} from '@angular/core';
import {SleeperService} from '../../services/sleeper.service';
import {PlayoffCalculatorService} from '../services/playoff-calculator.service';
import {SleeperTeam} from '../../model/SleeperLeague';
import {MatchupService} from '../services/matchup.service';
import {ConfigService} from '../../services/init/config.service';
import {NflService} from '../../services/utilities/nfl.service';
import {MatchUpUI} from '../model/matchup';
import {TransactionsService} from '../services/transactions.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {

  constructor(public sleeperService: SleeperService,
              public playoffCalculatorService: PlayoffCalculatorService,
              public matchupService: MatchupService,
              public configService: ConfigService,
              private nflService: NflService,
              public transactionService: TransactionsService) {
  }

  divisionTableCols = ['teamName', 'record', 'pf', 'ppf', 'pot'];

  /** closest wins columns */
  closestWinsCols = ['week', 'team1Name', 'score', 'team2Name', 'diff'];

  /** closest wins columns */
  pointsForCols = ['week', 'points', 'team1PointsFor', 'score', 'team2Name'];

  ngOnInit(): void {
    // TODO fix this
    if (this.sleeperService.selectedLeague) {
      if (this.matchupService.leagueMatchUpUI.length === 0 || this.playoffCalculatorService.matchUpsWithProb.length === 0) {
        console.warn('Warning: Match Data was not loaded correctly. Recalculating Data...');
        this.matchupService.initMatchUpCharts(this.sleeperService.selectedLeague);
      }
      const endWeek = this.playoffCalculatorService.getStartWeek();
      if (this.matchupService.leagueMedians.length === 0) {
        this.playoffCalculatorService.calculateLeagueMedians();
      }
      if (this.matchupService.leagueClosestWins.length === 0) {
        this.matchupService.getClosestWins(this.sleeperService.selectedLeague.startWeek, endWeek);
      }
      if (this.matchupService.leagueMostPointsFor.length === 0) {
        this.matchupService.getMostPointsForInWeek(this.sleeperService.selectedLeague.startWeek, endWeek);
      }
      if (!this.isTransactionAggComplete()) {
        this.transactionService.generateTransactionAggregate(this.playoffCalculatorService.getStartWeek());
      }
    }
  }

  roundNumber(num: number): number {
    return Math.round(num);
  }

  getPointPotentialPercent(team: SleeperTeam): number {
    return Math.round(team.roster.teamMetrics.fpts / team.roster.teamMetrics.ppts * 100);
  }

  /**
   * return rounded difference between two point totals
   * @param matchUp match up
   */
  getPointDifference(matchUp: MatchUpUI): number {
    return Math.round(Math.abs(matchUp.team1Points - matchUp.team2Points) * 100) / 100;
  }

  /**
   * returns true if transaction agg isn't empty
   */
  isTransactionAggComplete(): boolean {
    return JSON.stringify(this.transactionService.transactionAggregate) !== '{}';
  }
}