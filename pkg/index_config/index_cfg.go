package index_config

import (
	"sync"
)

var (
	GlobalIndexConfig = IndexConfig{}
)

type IndexConfig struct {
	indexesConfigs []IndexConfiguration

	mutex sync.Mutex
}

// {"name":"mich first index","table_name":"test_table","columns":[],"filters":[]}
type IndexConfiguration struct {
	Columns   []string            `json:"columns"`
	Filters   []IndexFilterEntity `json:"filters"`
	TableName string
}

type IndexFilterEntity struct {
	Column     string                 `json:"column"`
	Predicates []IndexFilterPredicate `json:"predicates"`
}

func (i *IndexConfig) Update(indexesConfigs []IndexConfiguration) {
	i.mutex.Lock()
	defer i.mutex.Unlock()

	i.indexesConfigs = indexesConfigs
}

func (i *IndexConfig) Get() []IndexConfiguration {
	i.mutex.Lock()
	defer i.mutex.Unlock()

	return i.indexesConfigs
}
