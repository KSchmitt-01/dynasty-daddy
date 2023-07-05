import { ValidateGridSelection, SearchGridPlayers, FetchAllGridPlayers } from '../middleware/gridService';

export const ValidateGridSelectionEndpoint = async (req, res) => {
  try {
    const { playerId, categories } = req.body;
    const isValid = await ValidateGridSelection(playerId, categories);
    res.status(200).json(isValid);
  } catch (err) {
    res.status(500).json(err.stack);
  }
};

export const FetchSearchedPlayersEndpoint = async (req, res) => {
  try {
    const searchValue = req.query.search;
    const allPlayers = await SearchGridPlayers(searchValue);
    res.status(200).json(allPlayers);
  } catch (err) {
    res.status(500).json(err.stack);
  }
};

export const FetchAllGridPlayersEndpoint = async (req, res) => {
  try {
    const searchValue = req.query.search;
    const allPlayers = await FetchAllGridPlayers(searchValue);
    res.status(200).json(allPlayers);
  } catch (err) {
    res.status(500).json(err.stack);
  }
};
