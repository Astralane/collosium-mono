CREATE TABLE IF NOT EXISTS default.tips
(
    `slot`                    UInt64,
    `tx_id`                   String,
    `instruction_index`       UInt32,
    `from`                    String,
    `to`                      String,
    `lamports`                UInt64,
    `inner_instruction_index` UInt32,
    `transaction_index`       UInt32,
    `tx_fee`                  UInt64,
    `multi_location`          String
) ENGINE = MergeTree()
      PRIMARY KEY (`slot`, `tx_id`)
      ORDER BY (`slot`, `tx_id`)