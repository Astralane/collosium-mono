package index_config

import (
	"errors"
	"strconv"
)

type IndexFilterPredicate struct {
	Type  IndexFilterPredicateType `json:"type"`
	Value []string                 `json:"value"`
}

type IndexFilterPredicateType = string

const (
	LT       IndexFilterPredicateType = "lt"
	GT       IndexFilterPredicateType = "gt"
	EQ       IndexFilterPredicateType = "eq"
	IN       IndexFilterPredicateType = "in"
	CONTAINS IndexFilterPredicateType = "contains"
)

func ApplyPredicate(pred IndexFilterPredicate, other []string) (bool, error) {
	if len(other) == 0 {
		return false, nil
	}

	switch pred.Type {
	case LT:
		return applyLT(pred, other[0])
	case GT:
		return applyGT(pred, other[0])
	case EQ:
		return applyEQ(pred, other[0])
	case IN:
		return applyIN(pred, other)
	case CONTAINS:
		return applyCONTAINS(pred, other)
	}
	return false, errors.New("Illegal predicate type, or not all possible values are covered")
}

func applyLT(pred IndexFilterPredicate, other string) (bool, error) {
	i1, err1 := strconv.ParseInt(other, 10, 64)
	i2, err2 := strconv.ParseInt(pred.Value[0], 10, 64)
	if err1 == nil && err2 == nil {
		return i1 < i2, nil
	}
	u1, err1 := strconv.ParseUint(other, 10, 64)
	u2, err2 := strconv.ParseUint(pred.Value[0], 10, 64)
	if err1 == nil && err2 == nil {
		return u1 < u2, nil
	}
	f1, err1 := strconv.ParseFloat(other, 64)
	f2, err2 := strconv.ParseFloat(pred.Value[0], 64)
	if err1 == nil && err2 == nil {
		return f1 < f2, nil
	}
	return false, errors.New("either predicate or incoming value cannot be cast to compare")
}

func applyGT(pred IndexFilterPredicate, other string) (bool, error) {
	i1, err1 := strconv.ParseInt(other, 10, 64)
	i2, err2 := strconv.ParseInt(pred.Value[0], 10, 64)
	if err1 == nil && err2 == nil {
		return i1 > i2, nil
	}
	u1, err1 := strconv.ParseUint(other, 10, 64)
	u2, err2 := strconv.ParseUint(pred.Value[0], 10, 64)
	if err1 == nil && err2 == nil {
		return u1 > u2, nil
	}
	f1, err1 := strconv.ParseFloat(other, 64)
	f2, err2 := strconv.ParseFloat(pred.Value[0], 64)
	if err1 == nil && err2 == nil {
		return f1 > f2, nil
	}
	return false, errors.New("either predicate or incoming value cannot be cast to compare")
}

func applyEQ(pred IndexFilterPredicate, other string) (bool, error) {
	return pred.Value[0] == other, nil
}

func applyIN(pred IndexFilterPredicate, other []string) (bool, error) {
	result := containsAll(pred.Value, other)
	return result, nil
}

func applyCONTAINS(pred IndexFilterPredicate, other []string) (bool, error) {
	result := containsAll(other, pred.Value)
	return result, nil
}

func containsAll(slice1, slice2 []string) bool {
	elementMap := make(map[string]bool)

	for _, element := range slice1 {
		elementMap[element] = true
	}

	for _, element := range slice2 {
		if !elementMap[element] {
			return false
		}
	}

	return true
}
