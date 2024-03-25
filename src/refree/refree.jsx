// referee.jsx
import { PieceType, TeamType } from '../components/constants';

export default class Refree {
    tileIsOccupied(x, y, initialBoardState) {
        const piece = initialBoardState.find(p => p.position.x === x && p.position.y === y);
        return !!piece;
    }

    tileIsOccupiedByOpponent(x, y, initialBoardState, team) {
        const piece = initialBoardState.find((p) => p.position.x === x && p.position.y === y && p.team !== team);
        return !!piece;
    }

    isEnPassantMove(px, py, x, y, type, team, initialBoardState) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((x - px === -1 || x - px === 1) && y - py === pawnDirection) {
                const piece = initialBoardState.find(
                    (p) => p.position.x === x && p.position.y === y - pawnDirection && p.enPassant
                );
                return !!piece;
            }
        }
        return false;
    }

    isValidMove(px, py, x, y, type, team, initialBoardState) {
        switch (type) {
            case PieceType.PAWN:
                return this.isValidPawnMove(px, py, x, y, team, initialBoardState);
            case PieceType.BISHOP:
                return this.isValidBishopMove(px, py, x, y, initialBoardState);
            case PieceType.KNIGHT:
                return this.isValidKnightMove(px, py, x, y);
            case PieceType.ROOK:
                return this.isValidRookMove(px, py, x, y, initialBoardState);
            case PieceType.QUEEN:
                return this.isValidQueenMove(px, py, x, y, initialBoardState);
            case PieceType.KING:
                return this.isValidKingMove(px, py, x, y);
            default:
                return false;
        }
    }

    isValidPawnMove(px, py, x, y, team, initialBoardState) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        // Forward movement
        if (x === px && y === py + pawnDirection && !this.tileIsOccupied(x, y, initialBoardState)) {
            return true;
        }

        // Initial double-step movement
        if (x === px && y === py + 2 * pawnDirection && py === (team === TeamType.OUR ? 1 : 6) && !this.tileIsOccupied(x, y, initialBoardState) && !this.tileIsOccupied(x, y - pawnDirection, initialBoardState)) {
            return true;
        }

        // Diagonal capture
        if ((x === px + 1 || x === px - 1) && y === py + pawnDirection && this.tileIsOccupiedByOpponent(x, y, initialBoardState, team)) {
            return true;
        }

        // En passant capture
        if ((x === px + 1 || x === px - 1) && y === py + pawnDirection && this.isEnPassantMove(px, py, x, y, PieceType.PAWN, team, initialBoardState)) {
            return true;
        }

        return false;
    }

    isValidBishopMove(px, py, x, y, initialBoardState) {
        // Diagonal movement
        if (Math.abs(x - px) === Math.abs(y - py)) {
            const dx = x > px ? 1 : -1;
            const dy = y > py ? 1 : -1;
            let tx = px + dx;
            let ty = py + dy;
            while (tx !== x && ty !== y) {
                if (this.tileIsOccupied(tx, ty, initialBoardState)) {
                    return false;
                }
                tx += dx;
                ty += dy;
            }
            return true;
        }
        return false;
    }

    isValidKnightMove(px, py, x, y) {
        // Knight's L-shaped movement
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    }

    isValidRookMove(px, py, x, y, initialBoardState) {
        // Horizontal movement
        if (x !== px && y === py) {
            const minX = Math.min(x, px);
            const maxX = Math.max(x, px);
            for (let i = minX + 1; i < maxX; i++) {
                if (this.tileIsOccupied(i, y, initialBoardState)) {
                    return false;
                }
            }
            return true;
        }
        // Vertical movement
        if (x === px && y !== py) {
            const minY = Math.min(y, py);
            const maxY = Math.max(y, py);
            for (let i = minY + 1; i < maxY; i++) {
                if (this.tileIsOccupied(x, i, initialBoardState)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    isValidQueenMove(px, py, x, y, initialBoardState) {
        // Queen's movement combines bishop and rook movement
        return this.isValidBishopMove(px, py, x, y, initialBoardState) || this.isValidRookMove(px, py, x, y, initialBoardState);
    }

    isValidKingMove(px, py, x, y) {
        // King's movement
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        return (dx <= 1 && dy <= 1);
    }
}
